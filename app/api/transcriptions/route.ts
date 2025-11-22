import { NextRequest, NextResponse } from "next/server";
import { getTranscriptions, addOrUpdateTranscription } from "./store";

// GET: Retrieve all transcriptions
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      transcriptions: getTranscriptions(),
    });
  } catch (error) {
    console.error("Error fetching transcriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transcriptions" },
      { status: 500 }
    );
  }
}

// POST: Create or update a transcription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      transcript,
      status = "active",
      title,
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 }
      );
    }

    addOrUpdateTranscription({
      sessionId,
      transcript,
      status,
      title,
    });

    return NextResponse.json({
      success: true,
      message: "Transcription updated",
    });
  } catch (error) {
    console.error("Error updating transcription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update transcription" },
      { status: 500 }
    );
  }
}

