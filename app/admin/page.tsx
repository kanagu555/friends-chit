"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { Header } from "@/components/layout/header"
import { MembersManager } from "@/components/admin/members-manager"

export default function AdminPage() {
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