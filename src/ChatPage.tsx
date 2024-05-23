// src/pages/ChatPage.tsx
import React, { useState } from 'react'
import UserList from './components/UserList/UserList'
import ChatList from './components/ChatList/ChatList'
import Chat from './components/Chat/Chat'
import { User } from './types/Message'

const ChatPage: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <UserList currentUser={currentUser} onSelectUser={handleSelectUser} />
        <ChatList currentUser={currentUser} onSelectChat={handleSelectUser} />
      </div>
      <div className="w-3/4">
        {selectedUser ? (
          <Chat currentUser={currentUser} otherUser={selectedUser} />
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
