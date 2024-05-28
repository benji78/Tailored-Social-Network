import React, { useEffect, useState } from 'react'

import { User } from '@/types/Types.ts'
import { Combobox } from '@/components/ComboBox/ComboBox'
import { useAuth } from '@/components/auth-context'
import supabase from '@/lib/supabase'

interface UserListProps {
  onSelectUser: (user: User) => void
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const { session } = useAuth()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    void fetchUsers()
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
      <Combobox users={users} onSelectUser={onSelectUser} />
    </div>
  )
}

export default UserList
