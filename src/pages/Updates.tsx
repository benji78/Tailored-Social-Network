import React, { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FlameIcon } from 'lucide-react'

interface Update {
  id: number
  project_id: number
  update_content: string
  created_at: string
  project_title: string
  project_description: string
  project_url: string
  username: string
  tags: string[]
}

const Updates: React.FC = () => {
  const [updates, setUpdates] = useState<Update[]>([])

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    const { data: updatesData, error } = await supabase
      .from('project_updates')
      .select(
        `
        id,
        project_id,
        update_content,
        created_at,
        projects (
          project_title,
          project_description,
          project_url,
          user_id
        )
      `
      )
      .order('created_at', { ascending: false }) // Order in descending order for display

    if (error) {
      console.error('Error fetching updates:', error)
      return
    }

    const userIds = updatesData.map((update: any) => update.projects.user_id)
    const { data: usersData, error: usersError } = await supabase
      .from('users2')
      .select('auth_id, username')
      .in('auth_id', userIds)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return
    }

    const projectIds = updatesData.map((update: any) => update.project_id)
    const { data: tagsData, error: tagsError } = await supabase
      .from('have_tags')
      .select('project_id, tags (name)')
      .in('project_id', projectIds)

    if (tagsError) {
      console.error('Error fetching tags:', tagsError)
      return
    }

    const formattedUpdates = updatesData.map((update: any) => {
      const user = usersData.find((user: any) => user.auth_id === update.projects.user_id)
      const tags = tagsData.filter((tag: any) => tag.project_id === update.project_id).map((tag: any) => tag.tags.name)
      return {
        id: update.id,
        project_id: update.project_id,
        update_content: update.update_content,
        created_at: update.created_at,
        project_title: update.projects.project_title,
        project_description: update.projects.project_description,
        project_url: update.projects.project_url,
        username: user ? user.username : 'Unknown',
        tags: tags,
      }
    })

    setUpdates(formattedUpdates)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
  }

  const calculateConsecutiveDays = (updates: Update[], projectId: number, username: string) => {
    const projectUpdates = updates
      .filter((update) => update.project_id === projectId && update.username === username)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    if (projectUpdates.length === 0) return 0

    let maxConsecutiveDays = 1
    let currentStreak = 1

    for (let i = 1; i < projectUpdates.length; i++) {
      const prevDate = new Date(projectUpdates[i - 1].created_at)
      const currDate = new Date(projectUpdates[i].created_at)
      const diffTime = currDate.getTime() - prevDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        currentStreak++
        maxConsecutiveDays = Math.max(maxConsecutiveDays, currentStreak)
      } else if (diffDays > 1) {
        currentStreak = 1
      }
    }

    return maxConsecutiveDays
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      year: date.getFullYear(),
    }
  }

  const renderDate = (dateString: string, index: number, updates: Update[]) => {
    if (index === 0 || new Date(dateString).toDateString() !== new Date(updates[index - 1].created_at).toDateString()) {
      const { month, day, year } = formatDate(dateString)
      return (
        <div className="my-4 flex w-full items-center justify-center text-primary">
          <div className="text-center">
            <p className="text-lg font-bold">{month}</p>
            <p className="text-6xl font-extrabold">{day}</p>
            <p className="text-lg">{year}</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex w-full flex-col items-center p-4 text-white">
      <ScrollArea className="max-h-[90vh] w-full">
        {updates.map((update, index) => (
          <React.Fragment key={update.id}>
            <div className="mb-4 flex">
              <div className="w-1/4">{renderDate(update.created_at, index, updates)}</div>
              <Card className="w-3/4 flex-grow shadow-lg">
                <div className="flex p-4">
                  <div className="w-full pl-4">
                    <CardHeader className="flex justify-between p-0">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full text-white">
                          {getInitials(update.username)}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-primary">
                            {update.project_title} <span className="text-sm text-gray-400">by {update.username}</span>
                          </CardTitle>
                          <p className="text-sm text-gray-400">{update.project_description}</p>
                          <div className="flex gap-1 text-sm text-gray-400">
                            {update.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block rounded bg-gray-200 px-2 py-1 text-sm text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-4 p-0">
                      <p className="mt-2 text-primary">{update.update_content}</p>
                      {update.project_url && (
                        <a
                          href={update.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block text-blue-500"
                        >
                          {update.project_url}
                        </a>
                      )}
                      <div className="mt-2 flex items-center text-gray-400">
                        <FlameIcon className="mr-2 h-5 w-5" />
                        {calculateConsecutiveDays(updates, update.project_id, update.username)}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          </React.Fragment>
        ))}
      </ScrollArea>
    </div>
  )
}

export default Updates
