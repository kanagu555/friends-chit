"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DrawHistory() {
  const [draws] = useState([
    { id: 1, cycle: "Cycle 1", drawNumber: 1, winner: "You", amount: 60000, date: "2024-01-15", status: "won" },
    {
      id: 2,
      cycle: "Cycle 1",
      drawNumber: 2,
      winner: "Priya Singh",
      amount: 60000,
      date: "2024-02-15",
      status: "not-won",
    },
    {
      id: 3,
      cycle: "Cycle 2",
      drawNumber: 1,
      winner: "Amit Patel",
      amount: 50000,
      date: "2024-02-20",
      status: "not-won",
    },
  ])

  const totalWinnings = draws.filter((d) => d.status === "won").reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Winnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">₹{totalWinnings.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground mt-1">
            From {draws.filter((d) => d.status === "won").length} draw(s)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Draw Results</CardTitle>
          <CardDescription>All draws you participated in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
                <Badge
                  className={
                    draw.status === "won" ? "bg-green-100 text-green-800 mt-2" : "bg-gray-100 text-gray-800 mt-2"
                  }
                >
                  {draw.status === "won" ? "Won" : "Not Won"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
