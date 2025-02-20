import { Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/hooks/useAuth'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" />

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar />
        <main className="container mx-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
