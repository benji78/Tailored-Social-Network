import React, { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/components/auth-context'

interface Project {
  id: number
  user_id: string
  project_title: string
  project_description: string
  project_url: string
  created_at: string
  updates: Update[]
}

interface Update {
  id: number
  project_id: number
  update_content: string
  created_at: string
}

const Project: React.FC = () => {
  const { session } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    url: '',
  })
  const [newUpdate, setNewUpdate] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', session?.user?.id)
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('Error fetching projects:', projectsError)
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

    const projectsWithUpdates = projectsData.map((project: Project) => ({
      ...project,
      updates: updatesData.filter((update: Update) => update.project_id === project.id),
    }))

    setProjects(projectsWithUpdates)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const { error } = await supabase.from('projects').insert({
      user_id: session?.user?.id,
      project_title: newProject.title,
      project_description: newProject.description,
      project_url: newProject.url,
    })

    if (error) {
      console.error('Error adding project:', error)
      return
    }

    setNewProject({ title: '', description: '', url: '' })
    fetchProjects()
  }

  const handleUpdateSubmit = async (projectId: number, event: React.FormEvent) => {
    event.preventDefault()

    const { error } = await supabase.from('project_updates').insert({
      project_id: projectId,
      update_content: newUpdate[projectId],
    })

    if (error) {
      console.error('Error adding update:', error)
      return
    }

    setNewUpdate({ ...newUpdate, [projectId]: '' })
    fetchProjects()
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
      <Card className="mb-8 w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid gap-4">
              <Input
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
              <Textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
              <Input
                placeholder="Project URL"
                value={newProject.url}
                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Add Project
            </Button>
          </form>
        </CardContent>
      </Card>

      <ScrollArea className="w-full max-w-4xl">
        {projects.map((project) => (
          <Card key={project.id} className="mb-4 shadow-lg">
            <CardHeader className="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
              <CardTitle className="text-2xl font-semibold text-white">{project.project_title}</CardTitle>
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
                <h3 className="text-lg font-semibold">Updates</h3>
                {renderUpdateCalendar(project.updates)}
                {project.updates
                  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                  .map((update) => (
                    <div key={update.id} className="mt-2">
                      <p className="text-gray-600">{update.update_content}</p>
                      <p className="text-sm text-gray-500">{new Date(update.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                <form onSubmit={(e) => handleUpdateSubmit(project.id, e)} className="mt-4">
                  <Textarea
                    placeholder="Add an update"
                    value={newUpdate[project.id] || ''}
                    onChange={(e) => setNewUpdate({ ...newUpdate, [project.id]: e.target.value })}
                  />
                  <Button type="submit" className="mt-2">
                    Add Update
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  )
}

export default Project
