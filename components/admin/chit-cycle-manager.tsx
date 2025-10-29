"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function ChitCycleManager() {
  const [cycles, setCycles] = useState([
    {
      id: 1,
      name: "Cycle 1 - 2024",
      amount: 5000,
      members: 12,
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      completedDraws: 8,
      totalDraws: 12,
    },
    {
      id: 2,
      name: "Cycle 2 - 2024",
      amount: 5000,
      members: 10,
      status: "active",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      completedDraws: 6,
      totalDraws: 10,
    },
    {
      id: 3,
      name: "Cycle 3 - 2025",
      amount: 5000,
      members: 2,
      status: "pending",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      completedDraws: 0,
      totalDraws: 12,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Cycle</CardTitle>
          <CardDescription>Start a new chit fund cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cycle-name">Cycle Name</Label>
                <Input id="cycle-name" placeholder="e.g., Cycle 4 - 2025" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chit-amount">Chit Amount (₹)</Label>
                <Input id="chit-amount" type="number" placeholder="5000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="members-count">Number of Members</Label>
                <Input id="members-count" type="number" placeholder="12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
            </div>
            <Button className="w-full">Create Cycle</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Cycles</CardTitle>
          <CardDescription>Manage your chit fund cycles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cycles.map((cycle) => (
              <div key={cycle.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{cycle.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cycle.startDate} to {cycle.endDate}
                    </p>
                  </div>
                  <Badge className={getStatusColor(cycle.status)}>
                    {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Chit Amount</p>
                    <p className="font-semibold">₹{cycle.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Members</p>
                    <p className="font-semibold">{cycle.members}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Draws</p>
                    <p className="font-semibold">
                      {cycle.completedDraws}/{cycle.totalDraws}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Pool</p>
                    <p className="font-semibold">₹{(cycle.amount * cycle.members).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Manage Members
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
