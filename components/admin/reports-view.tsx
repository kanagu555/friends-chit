"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function ReportsView() {
  const monthlyData = [
    { month: "Jan", collected: 60000, paid: 50000 },
    { month: "Feb", collected: 65000, paid: 55000 },
    { month: "Mar", collected: 70000, paid: 60000 },
    { month: "Apr", collected: 75000, paid: 65000 },
  ]

  const cycleData = [
    { name: "Cycle 1", value: 60000 },
    { name: "Cycle 2", value: 50000 },
    { name: "Cycle 3", value: 40000 },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Collections</CardTitle>
          <CardDescription>Collected vs Paid out</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="collected" fill="#3b82f6" />
              <Bar dataKey="paid" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribution by Cycle</CardTitle>
          <CardDescription>Total amount per cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cycleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {cycleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
