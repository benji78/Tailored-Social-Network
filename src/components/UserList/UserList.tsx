import React, { useState, useEffect } from 'react'
import supabase from '../../supabase'
import { User } from '../../types/Message'
import { ComboboxDemo } from '@/components/ComboBox/ComboBox'

interface UserListProps {
  onSelectUser: (user: User) => void
  currentUser: User
}

const UserList: React.FC<UserListProps> = ({ onSelectUser, currentUser }) => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users2').select('*')

    if (error) {
      console.error('Error fetching users:', error)
    } else {
      const filteredUsers = data?.filter((user: User) => user.id !== currentUser.id) || []
      setUsers(filteredUsers)
    }
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold">Users</h2>
      <ComboboxDemo users={users} onSelectUser={onSelectUser} />
    </div>
  )
}

export default UserList
