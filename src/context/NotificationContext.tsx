import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from './AuthContext'
import { useToast } from '../components/Toast'
import { connectSocket, disconnectSocket, onNewMessage } from '../api/socket'
import type { OrderMessage } from '../types'

const NotificationContext = createContext(null)

export function useNotifications() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const currentUserId = useRef(user?.id)

  useEffect(() => {
    currentUserId.current = user?.id
  }, [user?.id])

  useEffect(() => {
    if (!user) {
      disconnectSocket()
      return
    }

    connectSocket()

    const unsub = onNewMessage((msg: OrderMessage) => {
      if (msg.sender_id !== currentUserId.current) {
        const senderLabel = msg.sender_role === 'admin' ? 'Administrador' : msg.sender_name || 'Cliente'
        showToast(`Nuevo mensaje de ${senderLabel}: "${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}"`, 'info')
      }
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    })

    return () => {
      unsub()
    }
  }, [user, showToast, queryClient])

  return (
    <NotificationContext.Provider value={null}>
      {children}
    </NotificationContext.Provider>
  )
}
