import { io, Socket } from 'socket.io-client'
import type { OrderMessage } from '../types'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const url = baseUrl.replace(/\/api\/?$/, '')
    const token = localStorage.getItem('token')

    socket = io(url, {
      auth: { token },
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket() {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function joinOrderRoom(orderId: string) {
  const s = connectSocket()
  s.emit('join_order', orderId)
}

export function leaveOrderRoom(orderId: string) {
  const s = getSocket()
  s.emit('leave_order', orderId)
}

export function sendMessage(orderId: string, content: string) {
  const s = connectSocket()
  s.emit('send_message', { order_id: orderId, content })
}

export function onNewMessage(cb: (msg: OrderMessage) => void) {
  const s = connectSocket()
  s.on('new_message', cb)
  return () => { s.off('new_message', cb) }
}

export function onMessageRead(cb: (data: { order_id: string }) => void) {
  const s = connectSocket()
  s.on('messages_read', cb)
  return () => { s.off('messages_read', cb) }
}
