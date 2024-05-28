import React, { useState, useEffect } from 'react'
import { User } from '../../types/Types'
import { Button } from '../ui/button'
import { useAuth } from '../auth-context'
import supabase from '@/lib/supabase'

interface ChatListProps {
  onSelectChat: (user: User) => void
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const { session } = useAuth()
  const [chats, setChats] = useState<User[]>([])

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    const { data: messages, error: messageError } = await supabase
      .from('messages')
      .select('sender_id, receiver_id, created_at')
      .or(`sender_id.eq.${session?.user?.id},receiver_id.eq.${session?.user?.id}`)
      .order('created_at', { ascending: false })

    if (messageError) {
      console.error('Error fetching messages:', messageError)
      return
    }

    if (messages) {
      const uniqueChatIds = Array.from(
        new Set(messages.flatMap((msg: { sender_id: string; receiver_id: string }) => [msg.sender_id, msg.receiver_id]))
      ).filter((auth_id) => auth_id != session?.user?.id && auth_id !== null && auth_id !== undefined)

      if (uniqueChatIds.length > 0) {
        const { data: users, error: userError } = await supabase.from('users2').select('*').in('auth_id', uniqueChatIds)

        if (userError) {
          console.error('Error fetching users:', userError)
          return
        }

        const sortedUsers = users.sort((a, b) => {
          const aLastMessage = messages.find(
            (msg: { sender_id: string; receiver_id: string }) =>
              msg.sender_id == a.auth_id || msg.receiver_id == a.auth_id
          )?.created_at
          const bLastMessage = messages.find(
            (msg: { sender_id: string; receiver_id: string }) =>
              msg.sender_id == b.auth_id || msg.receiver_id == b.auth_id
          )?.created_at
          return new Date(bLastMessage).getTime() - new Date(aLastMessage).getTime()
        })

        setChats(sortedUsers || [])
      } else {
        console.log('No unique chat IDs found')
        setChats([])
      }
    }
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold">Recent Chats</h2>
      <ul>
        {chats.map((user) => (
          <li key={user.id} className="mb-2">
            <Button onClick={() => onSelectChat(user)} variant="link">
              {user.username}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatList
