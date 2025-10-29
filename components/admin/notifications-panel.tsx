"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "../notifications/notification-context"

export function NotificationsPanel() {
  const { addNotification } = useNotifications()
  const [allNotifications] = useState([
    {
      id: 1,
      type: "payment",
      title: "Payment Received",
      message: "Rajesh Kumar paid ₹5,000 for Cycle 1",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: 2,
      type: "draw",
      title: "Draw Completed",
      message: "Cycle 2 Draw #3 completed. Priya Singh won ₹50,000",
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
    {
      id: 3,
      type: "member",
      title: "New Member Added",
      message: "Amit Singh joined Cycle 3",
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
    {
      id: 4,
      type: "overdue",
      title: "Overdue Payment",
      message: "Neha Sharma has an overdue payment of ₹5,000",
      timestamp: new Date(Date.now() - 172800000),
      read: true,
    },
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return "💰"
      case "draw":
        return "🎲"
      case "member":
        return "👤"
      case "overdue":
        return "⚠️"
      default:
        return "📢"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const handleTestNotification = () => {
    addNotification({
      type: "success",
      title: "Test Notification",
      message: "This is a test notification from the admin panel",
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>All system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleTestNotification} className="w-full">
            Send Test Notification
          </Button>

          <div className="space-y-3">
            {allNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 ${notification.read ? "bg-muted/30" : "bg-card border-primary/20"}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{notification.title}</h3>
                      {!notification.read && <Badge className="text-xs">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatTime(notification.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
