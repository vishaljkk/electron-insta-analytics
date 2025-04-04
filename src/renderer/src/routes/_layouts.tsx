import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_layouts')({
  component: LayoutComponent,
})

interface UserData {
  username: string
  posts: string
  followers: string
  following: string
  fullName: string
}

declare global {
  interface Window {
    electronAPI: {
      onUserData: (callback: (data: UserData) => void) => void
    }
  }
}

export default function LayoutComponent() {
  const [userData, setUserData] = useState<UserData | undefined>(undefined)
  console.log(userData)

  useEffect(() => {
    if (window.electron) {
      console.log('window electron api was found')
      window.electron.ipcRenderer.on('user-data', (_event, data) => {
        alert('uhhh')
        console.log(data)
        setUserData(data)
        console.log('Received userData in React:', data)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 text-white">
      <nav className="p-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <Link
              to="/"
              className="hover:text-blue-400 transition-colors [&.active]:text-blue-400 [&.active]:font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-400 transition-colors [&.active]:text-blue-400 [&.active]:font-medium"
            >
              About
            </Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}
