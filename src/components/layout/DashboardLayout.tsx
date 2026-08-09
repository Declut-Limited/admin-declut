import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/generic/Sidebar'
import TopNav from '@/components/generic/TopNav'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}