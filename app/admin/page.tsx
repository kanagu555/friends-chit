"use client"

import { useEffect, useState } from 'react'
import { AuthGuard } from "@/components/auth/auth-guard"
import { Header } from "@/components/layout/header"
import { MembersManager } from "@/components/admin/members-manager"
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          <MembersManager />
        </div>
      </div>
    </AuthGuard>
  )
}