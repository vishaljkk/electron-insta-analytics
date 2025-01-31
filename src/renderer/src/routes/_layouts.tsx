import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layouts')({
  component: LayoutComponent,
})

export default function LayoutComponent() {
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
