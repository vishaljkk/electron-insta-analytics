import { InstagramProfileCard } from '@renderer/components/InstagramProfileCard'
import { createLazyFileRoute } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'

export const Route = createLazyFileRoute('/_layouts/')({
  component: Index,
})

function Index(): React.ReactElement {
  const [scrappedData, setScrappedData] = useState<any | undefined>({})

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3333')
    let heartbeatInterval

    socket.onopen = () => {
      console.log('Connected to external WS server')
      // Start heartbeat
      heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }))
        }
      }, 15000) // every 15s (adjust if needed)
    }

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data)
      const parsed = JSON.parse(event.data)
      if (parsed.type === "test-connection") {
        setScrappedData(parsed.message)
      }
    }

    socket.onerror = (err) => {
      console.error('WebSocket error:', err)
    }

    socket.onclose = () => {
      console.warn('WebSocket connection closed')
    }

    return () => {
      clearInterval(heartbeatInterval)
      socket.close()
    }
  }, [])

  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <section>
        {scrappedData ? <InstagramProfileCard data={scrappedData} /> : null}
      </section>
    </main>
  )
}
