// src/components/UserList.tsx
import React, { useState, useEffect } from 'react';
import supabase from '../../supabase';
import { User } from '../../types/Message';

interface UserListProps {
  onSelectUser: (user: User) => void;
  currentUser: User;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser, currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from<any, any>('users2').select('*');

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      const filteredUsers = data?.filter((user: User) => user.id !== currentUser.id) || [];
      setUsers(filteredUsers);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            <button onClick={() => onSelectUser(user)} className="text-blue-500">
              {user.username}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
