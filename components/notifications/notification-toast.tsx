"use client"

import { X } from "lucide-react"
import type { Notification } from "./notification-context"

interface NotificationToastProps {
  notification: Notification
  onClose: (id: string) => void
}

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "info":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✓"
      case "error":
        return "✕"
      case "warning":
        return "⚠"
      case "info":
        return "ℹ"
      default:
        return "•"
    }
  }

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2 ${getBackgroundColor(notification.type)}`}
    >
      <div className={`text-lg font-bold mt-0.5 ${getIconColor(notification.type)}`}>{getIcon(notification.type)}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{notification.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
      </div>
      <button
        onClick={() => onClose(notification.id)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  )
}
