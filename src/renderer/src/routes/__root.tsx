import { createRootRoute, Outlet } from '@tanstack/react-router'
import '../assets/base.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  )
})

