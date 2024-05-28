import '@/styles/globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from '@/pages/App'
import NotFound from '@/pages/not-found'
import Login from '@/pages/login'
import Signup from '@/pages/signup'
import AuthProvider from '@/components/auth-context'
import { Navbar } from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import ChatPage from './pages/ChatPage'
import Profile from './pages/profile'
import FriendRecommendationsPage from './pages/FriendRecommendationsPage'
import GraphVisualization from './components/graph/Graph'
import Project from './pages/Project'
import Updates from './pages/Updates'
import LeaderBoard from './pages/LeaderBoard'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route index element={<App />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="graph" element={<GraphVisualization />} />
              <Route path="friendRecommendation" element={<FriendRecommendationsPage />} />
              <Route path="my-projects" element={<Project />} />
              <Route path="updates" element={<Updates />} />
              <Route path="leaderboard" element={<LeaderBoard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
)
