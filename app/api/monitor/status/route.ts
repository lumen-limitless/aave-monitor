import { NextResponse } from "next/server"

import { getMonitorState } from "@/lib/monitor"

export async function GET() {
  try {
    const state = getMonitorState()
    return NextResponse.json({ success: true, data: state })
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
