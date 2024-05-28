import React, { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { calculateLongestStreak } from '@/lib/utils'

interface Project {
  id: number
  user_id: string
  project_title: string
  project_description: string
  project_url: string
  created_at: string
  updates: Update[]
  tags: Tag[]
  username: string // Added username field
}

interface Update {
  id: number
  project_id: number
  update_content: string
  created_at: string
}

interface Tag {
  id: number
  name: string
  description: string
}

const LeaderBoard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data: projectsData, error: projectsError } = await supabase.from('projects').select('*')

    if (projectsError) {
      console.error('Error fetching projects:', projectsError)
      return
    }

    const userIds = projectsData.map((project: Project) => project.user_id)
    const { data: usersData, error: usersError } = await supabase
      .from('users2')
      .select('auth_id, username')
      .in('auth_id', userIds)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return
    }

    const projectIds = projectsData.map((project: Project) => project.id)
    const { data: updatesData, error: updatesError } = await supabase
      .from('project_updates')
      .select('*')
      .in('project_id', projectIds)

    if (updatesError) {
      console.error('Error fetching updates:', updatesError)
      return
    }

    const { data: haveTagsData, error: haveTagsError } = await supabase
      .from('have_tags')
      .select('project_id, tags_id, tags(name)')
      .in('project_id', projectIds)

    if (haveTagsError) {
      console.error('Error fetching project tags:', haveTagsError)
      return
    }

    const projectsWithUpdatesAndTags = projectsData.map((project: Project) => {
      const user = usersData.find((user: any) => user.auth_id === project.user_id)
      return {
        ...project,
        updates: updatesData.filter((update: Update) => update.project_id === project.id),
        tags: haveTagsData.filter((tag) => tag.project_id === project.id).map((tag) => tag.tags),
        username: user ? user.username : 'Unknown', // Add username to project
      }
    })

    const sortedProjects = projectsWithUpdatesAndTags
      .sort((a, b) => {
        const aDays = (new Date().getTime() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24)
        const bDays = (new Date().getTime() - new Date(b.created_at).getTime()) / (1000 * 60 * 60 * 24)
        const aFrequency = a.updates.length / aDays
        const bFrequency = b.updates.length / bDays
        return bFrequency - aFrequency
      })
      .sort((a, b) => {
        const aLastUpdate = a.updates.length > 0 ? new Date(a.updates[a.updates.length - 1].created_at).getTime() : 0
        const bLastUpdate = b.updates.length > 0 ? new Date(b.updates[b.updates.length - 1].created_at).getTime() : 0
        return bLastUpdate - aLastUpdate
      })
      .sort((a, b) => b.updates.length - a.updates.length)
      .sort((a, b) => {
        const aTags = a.tags.length
        const bTags = b.tags.length
        return bTags - aTags
      })
      .sort((a, b) => {
        const aConsecutiveDays = calculateLongestStreak(a.updates)
        const bConsecutiveDays = calculateLongestStreak(b.updates)
        return bConsecutiveDays - aConsecutiveDays
      })

    setProjects(sortedProjects as unknown as Project[])
  }

  const renderUpdateCalendar = (updates: Update[]) => {
    const today = new Date()
    const daysInMonth = today.getDate()
    const updateDates = updates.map((update) => new Date(update.created_at).getDate())

    return (
      <div className="mt-2 flex gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={`flex h-6 w-6 items-center justify-center border ${
              updateDates.includes(day) ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            {updateDates.includes(day) ? '✔️' : day}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex max-h-screen w-full flex-col items-center p-4 text-white">
      <ScrollArea className="w-full">
        {projects.map((project) => (
          <Card key={project.id} className="mb-4 shadow-lg">
            <CardHeader className="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
              <CardTitle className="text-2xl font-semibold text-white">{project.project_title}</CardTitle>
              <span className="text-sm text-gray-300">by {project.username}</span> {/* Display username */}
            </CardHeader>
            <CardContent className="rounded-b-lg p-6">
              <p className="mt-4 text-gray-600">{project.project_description}</p>
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block text-blue-500 underline"
                >
                  {project.project_url}
                </a>
              )}
              <CardDescription className="mt-6 text-sm text-gray-500">
                {new Date(project.created_at).toLocaleDateString()}
              </CardDescription>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.length === 0 ? (
                    <span className="text-gray-500">No tags</span>
                  ) : (
                    project.tags.map((tag) => (
                      <span key={tag.id} className="inline-block rounded bg-gray-200 px-2 py-1 text-sm text-gray-800">
                        {tag.name}
                      </span>
                    ))
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold">Updates</h3>
                {renderUpdateCalendar(project.updates)}
                <p className="mt-2 text-gray-600">Number of updates: {project.updates.length}</p>
                <p className="mt-2 text-gray-600">
                  Consecutive days with updates: {calculateLongestStreak(project.updates)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  )
}

export default LeaderBoard
