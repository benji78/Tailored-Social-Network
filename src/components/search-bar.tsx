import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'

interface SearchFormProps {
  className?: string
  children?: React.ReactNode
}

function SearchBar({ className = '', children }: SearchFormProps) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    navigate(`/search?q=${search}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={`relative w-full ${className}`}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search ..."
          className="w-full appearance-none bg-background pl-8 shadow-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {children}
    </form>
  )
}

export default SearchBar
