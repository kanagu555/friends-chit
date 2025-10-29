"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PaymentsTracker() {
  const [payments] = useState([
    {
      id: 1,
      member: "Rajesh Kumar",
      cycle: "Cycle 1",
      amount: 5000,
      dueDate: "2024-01-15",
      status: "paid",
      paidDate: "2024-01-14",
    },
    {
      id: 2,
      member: "Priya Singh",
      cycle: "Cycle 2",
      amount: 5000,
      dueDate: "2024-02-15",
      status: "pending",
      paidDate: null,
    },
    {
      id: 3,
      member: "Amit Patel",
      cycle: "Cycle 1",
      amount: 5000,
      dueDate: "2024-01-15",
      status: "overdue",
      paidDate: null,
    },
    {
      id: 4,
      member: "Neha Sharma",
      cycle: "Cycle 3",
      amount: 5000,
      dueDate: "2025-01-15",
      status: "pending",
      paidDate: null,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalPending = payments.filter((p) => p.status !== "paid").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPending.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {payments.filter((p) => p.status === "overdue").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹60,000</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>Track all member payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Member</th>
                  <th className="text-left py-2 px-2">Cycle</th>
                  <th className="text-left py-2 px-2">Amount</th>
                  <th className="text-left py-2 px-2">Due Date</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-2 font-medium">{payment.member}</td>
                    <td className="py-2 px-2">{payment.cycle}</td>
                    <td className="py-2 px-2">₹{payment.amount.toLocaleString()}</td>
                    <td className="py-2 px-2">{payment.dueDate}</td>
                    <td className="py-2 px-2">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-2 px-2">
                      <Button size="sm" variant="ghost">
                        {payment.status === "pending" ? "Mark Paid" : "View"}
                      </Button>
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
