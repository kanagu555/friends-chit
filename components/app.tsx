"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { Header } from "@/components/layout/header"
import { Dashboard } from "@/components/dashboard/dashboard"

export function App() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Dashboard />
      </div>
    </AuthGuard>
  )
}