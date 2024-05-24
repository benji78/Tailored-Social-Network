import '@/styles/globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import NotFound from './components/not-found.tsx'
import Login from './components/auth/login.tsx'
import Signup from './components/auth/signup.tsx'
import FriendRecommendations from './FriendRecoPage.tsx'
import { User } from '@supabase/supabase-js'

const connectedUser: User = JSON.parse(localStorage.getItem('connectedUser') || '{}')

const router = createBrowserRouter([
  { path: '/', element: <App />, errorElement: <NotFound /> },
  { path: 'login', element: <Login /> },
  { path: 'signup', element: <Signup /> },
  { path: 'FriendRecommendation', element: <FriendRecommendations userId={connectedUser} /> },
  // { path: 'dashbord', element: <Dashbord /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
