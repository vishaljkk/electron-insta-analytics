import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layouts/about')({
  component: About,
})

function About(): React.ReactElement {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">About</h1>
      <div className="bg-black/20 p-6 rounded-lg">
        <p className="text-stone-300">
          This is a demo application showcasing Electron with React, TypeScript,
          and TanStack Router.
        </p>
      </div>
    </main>
  )
}
