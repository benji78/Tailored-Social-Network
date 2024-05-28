'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { User } from '../../types/Types'

interface ComboboxDemoProps {
  users: User[]
  onSelectUser: (user: User) => void
}

export function Combobox({ users, onSelectUser }: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    onSelectUser(user)
    setOpen(false)
  }

  const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {selectedUser ? selectedUser.username : 'Start chatting...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="p-2">
          <input
            type="text"
            placeholder="Search user..."
            className="mb-2 w-full rounded border border-gray-300 p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredUsers.length === 0 ? (
            <div className="p-2 text-gray-500">No user found.</div>
          ) : (
            <ul>
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className={`cursor-pointer p-2 ${selectedUser?.id === user.id ? 'bg-gray-200' : ''}`}
                  onClick={() => handleSelectUser(user)}
                >
                  <Check className={cn('mr-2 h-4 w-4', selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0')} />
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
