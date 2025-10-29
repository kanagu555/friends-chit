"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DrawsManager() {
  const [draws] = useState([
    {
      id: 1,
      cycle: "Cycle 1",
      drawNumber: 1,
      winner: "Rajesh Kumar",
      amount: 60000,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      cycle: "Cycle 1",
      drawNumber: 2,
      winner: "Priya Singh",
      amount: 60000,
      date: "2024-02-15",
      status: "completed",
    },
    {
      id: 3,
      cycle: "Cycle 2",
      drawNumber: 1,
      winner: "Amit Patel",
      amount: 50000,
      date: "2024-02-20",
      status: "completed",
    },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Draw History</CardTitle>
        <CardDescription>All completed and upcoming draws</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {draws.map((draw) => (
            <div key={draw.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {draw.cycle} - Draw #{draw.drawNumber}
                </h3>
                <p className="text-sm text-muted-foreground">Winner: {draw.winner}</p>
                <p className="text-sm text-muted-foreground">Date: {draw.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₹{draw.amount.toLocaleString()}</p>
                <Badge className="mt-2">{draw.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
