import { NextResponse } from "next/server"

import { forceCheck } from "@/lib/monitor"

export async function POST() {
  try {
    const result = await forceCheck()
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
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
