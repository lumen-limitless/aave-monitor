import { NextResponse } from "next/server"

import { getAaveAccountData, getHealthFactorStatus } from "@/lib/aave"

export async function GET() {
  try {
    const monitoredAddress = process.env.MONITORED_ADDRESS

    if (!monitoredAddress) {
      return NextResponse.json(
        { success: false, error: "MONITORED_ADDRESS is not configured" },
        { status: 400 }
      )
    }

    const accountData = await getAaveAccountData(monitoredAddress)
    const status = getHealthFactorStatus(accountData.healthFactorNumeric)

    return NextResponse.json({
      success: true,
      data: {
        ...accountData,
        status,
        address: monitoredAddress,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
