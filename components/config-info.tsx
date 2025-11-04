"use client"

export function ConfigInfo() {
  const monitoredAddress =
    process.env.NEXT_PUBLIC_MONITORED_ADDRESS || "Not set"
  const threshold = process.env.NEXT_PUBLIC_HEALTH_FACTOR_THRESHOLD || "Not set"

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Configuration</h3>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-gray-600">Monitored Address:</p>
          <p className="font-mono text-xs break-all">{monitoredAddress}</p>
        </div>

        <div>
          <p className="text-gray-600">Health Factor Threshold:</p>
          <p className="font-medium">{threshold}</p>
        </div>

        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <p className="font-medium">⚙️ Configuration Note:</p>
          <p className="mt-1">
            To monitor your own address, update the <code>.env.local</code> file
            with your settings. See <code>.env.example</code> for all available
            options.
          </p>
        </div>
      </div>
    </div>
  )
}
