import React from 'react'
import Graph from './graph/Graph'
import { User } from '@supabase/supabase-js'

const App: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="App">
      <Graph user={user} />
    </div>
  )
}

export default App
