import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useOrderMessages, useSendMessage } from '../api/hooks'
import { joinOrderRoom, leaveOrderRoom, onNewMessage, sendMessage as socketSend } from '../api/socket'
import type { OrderMessage } from '../types'

interface OrderChatProps {
  orderId: string
  onSent?: () => void
}

export default function OrderChat({ orderId, onSent }: OrderChatProps) {
  const { user } = useAuth()
  const { data: messages = [] } = useOrderMessages(orderId)
  const sendMessage = useSendMessage()
  const [input, setInput] = useState('')
  const [localMessages, setLocalMessages] = useState<OrderMessage[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const allMessages = [...messages, ...localMessages.filter(
    lm => !messages.some(m => m.id === lm.id)
  )]

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [allMessages.length])

  useEffect(() => {
    joinOrderRoom(orderId)
    const unsub = onNewMessage((msg) => {
      if (msg.order_id === orderId) {
        setLocalMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev
          return [...prev, msg]
        })
      }
    })
    return () => {
      leaveOrderRoom(orderId)
      unsub()
    }
  }, [orderId])

  useEffect(() => {
    setLocalMessages([])
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')

    socketSend(orderId, text)

    try {
      await sendMessage.mutateAsync({ orderId, content: text })
      onSent?.()
    } catch {
      setLocalMessages(prev => [...prev, {
        id: `temp-${Date.now()}`,
        order_id: orderId,
        sender_id: user?.id || '',
        sender_role: user?.role === 'admin' ? 'admin' : 'customer',
        content: text,
        created_at: new Date().toISOString(),
        read: false,
      }])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-card)' }}>
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          Mensajes
        </h3>
      </div>

      <div ref={scrollRef} className="h-72 overflow-y-auto p-4 space-y-3">
        {allMessages.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            No hay mensajes todavía. Escribí una consulta sobre tu orden.
          </p>
        )}
        {allMessages.map((msg) => {
          const isMe = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                isMe
                  ? 'text-white rounded-br-md'
                  : 'rounded-bl-md border'
              }`} style={isMe
                ? { backgroundColor: 'var(--color-primary)' }
                : { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }
              }>
                {!isMe && (
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>
                    {msg.sender_role === 'admin' ? 'Administrador' : 'Tú'}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí tu mensaje..."
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sendMessage.isPending}
            className="px-4 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
