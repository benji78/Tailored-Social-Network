// src/components/ChatList.tsx
import React, { useState, useEffect } from 'react'
import supabase from '../../supabase'
import { User } from '../../types/Message'

interface ChatListProps {
  currentUser: User
  onSelectChat: (user: User) => void
}

const ChatList: React.FC<ChatListProps> = ({ currentUser, onSelectChat }) => {
  const [chats, setChats] = useState<User[]>([])

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    const { data: messages, error: messageError } = await supabase
      .from<string, any>('messages')
      .select('sender_id, receiver_id, created_at')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: false })

    if (messageError) {
      console.error('Error fetching messages:', messageError)
      return
    }

    if (messages) {
      const uniqueChatIds = Array.from(new Set(messages.flatMap((msg) => [msg.sender_id, msg.receiver_id]))).filter(
        (id) => id !== currentUser.id
      )

      if (uniqueChatIds.length > 0) {
        const { data: users, error: userError } = await supabase
          .from<any, any>('users2')
          .select('*')
          .in('id', uniqueChatIds)

        if (userError) {
          console.error('Error fetching users:', userError)
          return
        }

        const sortedUsers = users.sort((a, b) => {
          const aLastMessage = messages.find(
            (msg) => msg.sender_id === a.id || msg.receiver_id === a.id
          )?.created_at;
          const bLastMessage = messages.find(
            (msg) => msg.sender_id === b.id || msg.receiver_id === b.id
          )?.created_at;
          return new Date(bLastMessage).getTime() - new Date(aLastMessage).getTime();
        });

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
            <button onClick={() => onSelectChat(user)} className="text-blue-500">
              {user.username}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatList
