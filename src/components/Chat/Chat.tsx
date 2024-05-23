// src/components/Chat.tsx
import React, { useState, useEffect } from 'react'
import supabase from '../../supabase'
import { Message } from '../../types/Message'

interface ChatProps {
  currentUser: { id: string }
  otherUser: { id: string, username: string }
}

const Chat: React.FC<ChatProps> = ({ currentUser, otherUser }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('messages')
      .on<Message>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new
        if (
          (newMessage.sender_id === currentUser.id && newMessage.receiver_id === otherUser.id) ||
          (newMessage.sender_id === otherUser.id && newMessage.receiver_id === currentUser.id)
        ) {
          setMessages((messages) => [...messages, newMessage])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser.id, otherUser.id])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from<string, any>('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUser.id}),` +
        `and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUser.id})`
      )
      .order('created_at', { ascending: true })

    setMessages(data || [])
  }

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const { error } = await supabase.from<string, any>('messages').insert<Message>([
        {
          sender_id: currentUser.id,
          receiver_id: otherUser.id,
          content: newMessage.trim(),
        },
      ])

      if (error) console.error(error)
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <h2 className="text-lg font-bold">Chatting with {otherUser.username}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`my-2 rounded-lg p-2 ${
              message.sender_id === currentUser.id
                ? 'self-end bg-blue-500 text-white'
                : 'self-start bg-gray-300 text-black'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex border-t border-gray-200 p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 rounded-lg border p-2 focus:border-blue-300 focus:outline-none focus:ring"
        />
        <button onClick={sendMessage} className="ml-4 rounded-lg bg-blue-500 p-2 text-white">
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
