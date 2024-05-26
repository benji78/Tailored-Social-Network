import React, { useState, useEffect } from 'react'

import { User } from '../../types/Message'
import { ComboboxDemo } from '@/components/ComboBox/ComboBox'
import { useAuth } from '../auth-context'
import supabase from '@/lib/supabase'

interface UserListProps {
  onSelectUser: (user: User) => void
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const { session } = useAuth()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users2').select('*')

    if (error) {
      console.error('Error fetching users:', error)
    } else {
      const filteredUsers = data?.filter((user: User) => user.auth_id !== session?.user?.id) || []
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
