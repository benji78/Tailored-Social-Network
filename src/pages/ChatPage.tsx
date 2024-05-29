// src/pages/ChatPage.tsx
import { useState } from 'react'
import UserList from '@/components/UserList/UserList'
import ChatList from '@/components/ChatList/ChatList'
import Chat from '@/components/Chat/Chat'
import { User } from '@/types/Types.ts'

const ChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <UserList onSelectUser={handleSelectUser} />
        <ChatList onSelectChat={handleSelectUser} />
      </div>
      <div className="max-h-[90vh] w-3/4">
        {selectedUser ? (
          <Chat otherUser={selectedUser} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
