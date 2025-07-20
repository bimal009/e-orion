"use client"

import { Loader2 } from "lucide-react"


export function FullScreenLoader({
  
}) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 p-8">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        
      </div>
    </div>
  )
}