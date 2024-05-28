export interface User {
  id: string
  auth_id: string
  name: string
  username: string
  bio?: string
  website?: string
  linkedin?: string
  github?: string
  youtube?: string
  created_at?: string
}

export interface Message {
  id?: string
  sender_id: string
  receiver_id: string
  content: string
  created_at?: string
}

export interface Update {
  id: number
  project_id: number
  update_content: string
  created_at: string
  project_title?: string
  project_description?: string
  project_url?: string
  username?: string
  tags?: string[]
}
