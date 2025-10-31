"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MyContributions } from "./my-contributions"
import { DrawHistory } from "./draw-history"
import { ChitCalculator } from "./chit-calculator"
import { SchemeDetail } from "./scheme-detail"

export function MemberDashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Friends Chit</h1>
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
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">Cycle 1 & 2</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Contributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹30,000</div>
              <p className="text-xs text-muted-foreground mt-1">6 months</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Amount Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹60,000</div>
              <p className="text-xs text-muted-foreground mt-1">From draw #1</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Payment Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹5,000</div>
              <p className="text-xs text-muted-foreground mt-1">15 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scheme">Scheme Detail</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="draws">Draws</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Cycles</CardTitle>
                  <CardDescription>Cycles you are part of</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Cycle 1 - 2024</h3>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Chit: ₹5,000 | Members: 12</p>
                    <p className="text-sm text-muted-foreground">Draws: 8/12 completed</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Cycle 2 - 2024</h3>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Chit: ₹5,000 | Members: 10</p>
                    <p className="text-sm text-muted-foreground">Draws: 6/10 completed</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                  <CardDescription>Your upcoming payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Cycle 1 - January</h3>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">₹5,000 | Paid on 2024-01-14</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Cycle 2 - February</h3>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">₹5,000 | Due on 2024-02-15</p>
                    <Button size="sm" className="mt-2 w-full">
                      Pay Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheme">
            {/* <SchemeDetail /> */}
          </TabsContent>

          <TabsContent value="contributions">
            <MyContributions />
          </TabsContent>

          <TabsContent value="draws">
            <DrawHistory />
          </TabsContent>

          <TabsContent value="calculator">
            <ChitCalculator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
