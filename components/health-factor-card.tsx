"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface HealthFactorData {
  healthFactor: string
  healthFactorNumeric: number
  totalCollateralBase: string
  totalDebtBase: string
  status: {
    status: "safe" | "warning" | "danger" | "none"
    color: string
    message: string
  }
}

export function HealthFactorCard() {
  const [data, setData] = useState<HealthFactorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHealthFactor = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/health-factor")
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        setError(null)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthFactor()
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthFactor, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
          <div className="mb-2 h-12 w-40 rounded bg-gray-200"></div>
          <div className="h-4 w-48 rounded bg-gray-200"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-red-900">Error</h3>
        <p className="text-sm text-red-700">{error}</p>
        <button
          onClick={fetchHealthFactor}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "danger":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-6 shadow-sm transition-colors",
        getStatusColor(data.status.status)
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Health Factor</h3>
        <button
          onClick={fetchHealthFactor}
          className="text-sm underline opacity-70 hover:opacity-100"
          title="Refresh"
        >
          Refresh
        </button>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-4xl font-bold">
          {data.healthFactorNumeric === 0
            ? "N/A"
            : data.healthFactorNumeric.toFixed(4)}
        </div>
        <p className="text-sm font-medium">{data.status.message}</p>
      </div>

      <div className="space-y-2 border-t pt-4 text-sm opacity-80">
        <div className="flex justify-between">
          <span>Total Collateral:</span>
          <span className="font-medium">
            ${parseFloat(data.totalCollateralBase).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Total Debt:</span>
          <span className="font-medium">
            ${parseFloat(data.totalDebtBase).toFixed(2)}
          </span>
        </div>
      </div>

      {data.status.status === "danger" && (
        <div className="mt-4 rounded border border-red-300 bg-red-100 p-3 text-sm">
          <p className="font-semibold">⚠️ Action Required</p>
          <p className="mt-1 text-xs">
            Your position is at risk of liquidation. Consider adding collateral
            or repaying debt.
          </p>
        </div>
      )}
    </div>
  )
}
