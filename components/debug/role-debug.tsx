"use client"

import { useAuth } from "@/hooks/use-auth"
import { getUserRole } from "@/lib/user-roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RoleDebug() {
  const { user } = useAuth()

  if (!user) return null

  const detectedRole = getUserRole(user.email)

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">🐛 Role Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-1">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Detected Role:</strong> {detectedRole}</p>
          <p><strong>User Object Role:</strong> {user.role}</p>
          <p><strong>Is Admin:</strong> {user.role === 'admin' ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        </div>
      </CardContent>
    </Card>
  )
}