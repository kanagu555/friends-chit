"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MyContributions() {
  const [contributions] = useState([
    {
      id: 1,
      cycle: "Cycle 1",
      month: "January",
      amount: 5000,
      dueDate: "2024-01-15",
      status: "paid",
      paidDate: "2024-01-14",
    },
    {
      id: 2,
      cycle: "Cycle 1",
      month: "February",
      amount: 5000,
      dueDate: "2024-02-15",
      status: "paid",
      paidDate: "2024-02-14",
    },
    {
      id: 3,
      cycle: "Cycle 2",
      month: "February",
      amount: 5000,
      dueDate: "2024-02-15",
      status: "pending",
      paidDate: null,
    },
    { id: 4, cycle: "Cycle 1", month: "March", amount: 5000, dueDate: "2024-03-15", status: "pending", paidDate: null },
  ])

  const getStatusColor = (status: string) => {
    return status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  const totalContributed = contributions.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Contributed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{totalContributed.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground mt-1">Across all cycles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contribution History</CardTitle>
          <CardDescription>All your payments and contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Cycle</th>
                  <th className="text-left py-2 px-2">Month</th>
                  <th className="text-left py-2 px-2">Amount</th>
                  <th className="text-left py-2 px-2">Due Date</th>
                  <th className="text-left py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((contribution) => (
                  <tr key={contribution.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-2 font-medium">{contribution.cycle}</td>
                    <td className="py-2 px-2">{contribution.month}</td>
                    <td className="py-2 px-2">₹{contribution.amount.toLocaleString()}</td>
                    <td className="py-2 px-2">{contribution.dueDate}</td>
                    <td className="py-2 px-2">
                      <Badge className={getStatusColor(contribution.status)}>
                        {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
