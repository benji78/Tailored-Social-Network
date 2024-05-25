import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { AuthError, Session, User } from '@supabase/supabase-js'
import supabase from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  logIn: (email: string, password: string) => Promise<AuthError | null>
  logOut: () => Promise<AuthError | null>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setSession(session)
    })

    return () => {
      data.subscription?.unsubscribe()
    }
  }, [])

  const logIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }

  const logOut = async (scope: 'global' | 'local' | 'others' = 'local') => {
    const { error } = await supabase.auth.signOut({ scope })
    setUser(null)
    setSession(null)
    return error
  }

  return <AuthContext.Provider value={{ user, session, logIn, logOut }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
