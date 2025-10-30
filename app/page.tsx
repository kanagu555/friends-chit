"use client"

import { useEffect, useState } from 'react'
import { App } from "@/components/app"
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading application...</p>
        </div>
      </div>
    )
  }

  return <App />
}