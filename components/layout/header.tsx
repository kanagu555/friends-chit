"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { LogOut, User, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
    } else {
      toast({
        title: "Logout Failed",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  if (!user) return null

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Chit Fund Manager</h1>
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="flex items-center gap-1">
            {user.role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {user.role.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}