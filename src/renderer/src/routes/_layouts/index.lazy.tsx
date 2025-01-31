import Versions from '@renderer/components/Versions'
import { createLazyFileRoute } from '@tanstack/react-router'
import React from 'react'
import electronLogo from '../../assets/electron.svg'

export const Route = createLazyFileRoute('/_layouts/')({
  component: Index,
})

function Index(): React.ReactElement {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4 text-center">
      <img
        alt="Electron Logo"
        className="w-32 mx-auto mb-8 animate-pulse"
        src={electronLogo}
      />
      <h1 className="text-4xl font-bold mb-4">Welcome to Electron-Vite</h1>
      <p className="text-xl mb-8 text-stone-300">
        Build an Electron app with{' '}
        <span className="text-cyan-400 font-semibold">React</span> and{' '}
        <span className="text-blue-400 font-semibold">TypeScript</span>
      </p>

      <div className="bg-black/20 p-4 rounded-lg inline-block mb-8">
        <p className="text-stone-300">
          Press <code className="bg-stone-700 px-2 py-1 rounded">F12</code> to
          open DevTools
        </p>
      </div>

      <div className="flex gap-4 justify-center mb-12">
        <a
          href="https://electron-vite.org/"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
        >
          Documentation
        </a>
        <button
          onClick={() => {}}
          className="px-6 py-2 bg-stone-700 hover:bg-stone-600 rounded-full transition-colors"
        >
          Send IPC
        </button>
      </div>

      <Versions />
    </main>
  )
}
