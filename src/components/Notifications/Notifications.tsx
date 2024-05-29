import React, { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-context'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Bell } from 'lucide-react'

interface Notification {
  id: number
  user_id: string
  content: string
  is_read: boolean
  created_at: string
}

const Notifications: React.FC = () => {
  const { session } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetchNotifications()

    const notificationChannel = supabase
      .channel('notifications')
      .on<Notification>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload: { new: Notification }) => {
          const newNotification = payload.new
          if (newNotification.user_id === session?.user?.id) {
            setNotifications((prevNotifications) => [newNotification, ...prevNotifications])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(notificationChannel)
    }
  }, [session?.user?.id])

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session?.user?.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notifications:', error)
      return
    }

    setNotifications(data)
  }

  const markAsRead = async (id: number) => {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id)

    if (error) {
      console.error('Error marking notification as read:', error)
      return
    }

    fetchNotifications()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="text-md">
          <Bell className="me-2 h-5 w-5" />({notifications.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        {notifications.length === 0 ? (
          <div className="p-2">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="border-b p-2">
              <p>{notification.content}</p>
              <Button onClick={() => markAsRead(notification.id)} variant="link">
                Mark as read
              </Button>
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  )
}

export default Notifications
