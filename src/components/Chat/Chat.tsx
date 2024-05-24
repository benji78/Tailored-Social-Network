// src/components/Chat.tsx
import React, { useState, useEffect } from 'react'
import supabase from '../../supabase'
import { Message } from '../../types/Message'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import ChatMessage from '../ChatMessage/ChatMessage'

interface ChatProps {
  currentUser: { id: string }
  otherUser: { id: string; username: string }
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <h2 className="text-lg font-bold">Chatting with {otherUser.username}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} isCurrentUser={message.sender_id === currentUser.id} />
          ))
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </div>
      <div className="flex gap-2 border-t border-gray-200 p-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          type="text"
          placeholder="Type your message"
        />
        <Button onClick={sendMessage} type="submit">
          Send
        </Button>
      </div>
    </div>
  )
}

export default Chat
