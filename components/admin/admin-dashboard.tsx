"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MembersManager } from "./members-manager"
import { 
  Users, 
  TrendingUp, 
  IndianRupee, 
  Clock, 
  Activity,
  Plus,
  Eye,
  FileText,
  Bell
} from "lucide-react"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - replace with real data from your backend
  const stats = {
    activeCycles: 3,
    totalMembers: 24,
    pendingPayments: 45000,
    totalCollected: 240000,
    pendingDraws: 2,
    membersAcrossCycles: 24,
    membersWithPending: 8,
    collectedThisMonth: 240000
  }

  const recentActivity = [
    {
      id: 1,
      type: "payment",
      title: "Payment Received",
      description: "Rajesh Kumar paid ₹5,000",
      amount: "+₹5,000",
      status: "success",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "draw",
      title: "Draw Completed",
      description: "Cycle 2 - Priya won ₹50,000",
      badge: "Draw #2",
      status: "completed",
      time: "1 day ago"
    },
    {
      id: 3,
      type: "member",
      title: "New Member Added",
      description: "Amit Singh joined Cycle 3",
      badge: "New",
      status: "new",
      time: "2 days ago"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Cycles</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCycles}</div>
            <p className="text-xs text-gray-500">{stats.pendingDraws} pending draws</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-gray-500">Across all cycles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-gray-500">From {stats.membersWithPending} members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Collected</CardTitle>
            <IndianRupee className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalCollected / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="cycles" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Cycles
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest transactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        {activity.badge && (
                          <Badge variant={activity.status === 'success' ? 'default' : 
                                        activity.status === 'completed' ? 'secondary' : 'outline'}>
                            {activity.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                    {activity.amount && (
                      <div className="text-right">
                        <span className="font-semibold text-green-600">{activity.amount}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cycle Management</CardTitle>
              <CardDescription>Manage chit fund cycles and draws</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Cycle Management</h3>
                <p className="text-gray-600 mb-4">Create and manage chit fund cycles</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Cycle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <MembersManager />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>Track and manage member payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Payment Tracking</h3>
                <p className="text-gray-600 mb-4">Monitor payments and collections</p>
                <Button>
                  <Eye className="h-4 w-4 mr-2" />
                  View All Payments
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Generate reports and view analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Reports</h3>
                <p className="text-gray-600 mb-4">Generate detailed reports</p>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Notifications</h3>
                <p className="text-gray-600 mb-4">Send alerts and reminders</p>
                <Button>
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}