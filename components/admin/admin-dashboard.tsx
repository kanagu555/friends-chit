"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChitCycleManager } from "./chit-cycle-manager"
import { MembersManager } from "./members-manager"
import { PaymentsTracker } from "./payments-tracker"
import { ReportsView } from "./reports-view"
import { NotificationsPanel } from "./notifications-panel"

export function AdminDashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Friends Chit - Admin</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Cycles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">2 pending draws</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">Across all cycles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,000</div>
              <p className="text-xs text-muted-foreground mt-1">From 8 members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2.4L</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cycles">Cycles</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="font-medium">Payment Received</p>
                      <p className="text-sm text-muted-foreground">Rajesh Kumar paid ₹5,000</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">+₹5,000</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="font-medium">Draw Completed</p>
                      <p className="text-sm text-muted-foreground">Cycle 2 - Priya won ₹50,000</p>
                    </div>
                    <span className="text-sm font-semibold">Draw #2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Member Added</p>
                      <p className="text-sm text-muted-foreground">Amit Singh joined Cycle 3</p>
                    </div>
                    <span className="text-sm font-semibold">New</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cycles">
            <ChitCycleManager />
          </TabsContent>

          <TabsContent value="members">
            <MembersManager />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsTracker />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsView />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
