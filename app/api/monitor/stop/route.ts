import { NextResponse } from "next/server"

import { stopMonitor } from "@/lib/monitor"

export async function POST() {
  try {
    const result = stopMonitor()
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
