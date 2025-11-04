"use client"

import { useEffect, useState } from "react"

interface MonitorState {
  isRunning: boolean
  lastCheck: string | null
  lastNotification: string | null
  currentHealthFactor: number | null
  error: string | null
  checkCount: number
}

export function MonitorControls() {
  const [state, setState] = useState<MonitorState | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/monitor/status")
      const result = await response.json()

      if (result.success) {
        setState(result.data)
      }
    } catch (_err) {
      console.error("Failed to fetch monitor status:", _err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Refresh every 10 seconds
    const interval = setInterval(fetchStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleStart = async () => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/monitor/start", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        await fetchStatus()
      } else {
        alert(result.message)
      }
    } catch (_err) {
      alert("Failed to start monitor")
    } finally {
      setActionLoading(false)
    }
  }

  const handleStop = async () => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/monitor/stop", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        await fetchStatus()
      } else {
        alert(result.message)
      }
    } catch (_err) {
      alert("Failed to stop monitor")
    } finally {
      setActionLoading(false)
    }
  }

  const handleForceCheck = async () => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/monitor/check", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        await fetchStatus()
        alert("Health factor check completed")
      } else {
        alert(result.error || "Failed to check health factor")
      }
    } catch (_err) {
      alert("Failed to check health factor")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
          <div className="h-10 w-full rounded bg-gray-200"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Monitor Controls</h3>

      <div className="mb-4 flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${state?.isRunning ? "bg-green-500" : "bg-gray-400"}`}
        ></div>
        <span className="text-sm font-medium">
          {state?.isRunning ? "Running" : "Stopped"}
        </span>
      </div>

      <div className="mb-4 space-y-2 text-sm">
        {state?.lastCheck && (
          <div>
            <span className="text-gray-600">Last Check:</span>{" "}
            <span className="font-medium">
              {new Date(state.lastCheck).toLocaleString()}
            </span>
          </div>
        )}
        {state?.checkCount !== undefined && (
          <div>
            <span className="text-gray-600">Total Checks:</span>{" "}
            <span className="font-medium">{state.checkCount}</span>
          </div>
        )}
        {state?.lastNotification && (
          <div>
            <span className="text-gray-600">Last Notification:</span>{" "}
            <span className="font-medium">
              {new Date(state.lastNotification).toLocaleString()}
            </span>
          </div>
        )}
        {state?.error && (
          <div className="rounded border border-red-300 bg-red-50 p-2 text-red-700">
            Error: {state.error}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!state?.isRunning ? (
          <button
            onClick={handleStart}
            disabled={actionLoading}
            className="flex-1 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoading ? "Starting..." : "Start Monitor"}
          </button>
        ) : (
          <>
            <button
              onClick={handleStop}
              disabled={actionLoading}
              className="flex-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading ? "Stopping..." : "Stop Monitor"}
            </button>
            <button
              onClick={handleForceCheck}
              disabled={actionLoading}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Check Now
            </button>
          </>
        )}
      </div>

      <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
        <p className="font-medium">ℹ️ How it works:</p>
        <ul className="mt-1 ml-4 list-disc space-y-1 text-xs">
          <li>Monitor checks your health factor periodically</li>
          <li>Sends email alerts when below threshold</li>
          <li>1-hour cooldown between notifications</li>
        </ul>
      </div>
    </div>
  )
}
