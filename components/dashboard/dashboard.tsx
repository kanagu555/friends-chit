"use client"

import { useAuth } from "@/hooks/use-auth"
import { MembersManager } from "@/components/admin/members-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, User } from "lucide-react"

export function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {user.role === 'admin' ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
            Welcome, {user.role === 'admin' ? 'Administrator' : 'Member'}
          </CardTitle>
          <CardDescription>
            Logged in as: {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
              {user.role.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {user.role === 'admin' 
                ? 'You have full access to manage the chit fund system'
                : 'You can view your member information and participate in chit funds'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Role-based Content */}
      {user.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <MemberDashboard />
      )}
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin Panel
          </CardTitle>
          <CardDescription>
            Manage members, chit funds, and system settings
          </CardDescription>
        </CardHeader>
      </Card>
      
      <MembersManager />
    </div>
  )
}

function MemberDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Member Dashboard</CardTitle>
          <CardDescription>
            View your chit fund participation and account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Chits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Currently participating</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹25,000</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹5,000</div>
                <p className="text-xs text-muted-foreground">Due in 5 days</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">Payment made for Chit #1</span>
                <Badge variant="outline">₹5,000</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">Joined new chit fund</span>
                <Badge variant="secondary">New</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}