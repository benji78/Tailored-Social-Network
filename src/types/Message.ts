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
