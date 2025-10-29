"use client"

import { useNotifications } from "./notification-context"
import { NotificationToast } from "./notification-toast"

export function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} onClose={removeNotification} />
      ))}
    </div>
  )
}
