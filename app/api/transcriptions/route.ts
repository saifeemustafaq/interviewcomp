import { NextRequest, NextResponse } from "next/server";
import { getTranscriptions, addOrUpdateTranscription, completeTranscription } from "./store";

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

// PATCH: Complete/stop a transcription
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, id } = body;

    const identifier = sessionId || id;
    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "sessionId or id is required" },
        { status: 400 }
      );
    }

    const completed = completeTranscription(identifier);
    
    if (completed) {
      return NextResponse.json({
        success: true,
        message: "Transcription completed",
        transcription: completed,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Transcription not found or already completed" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error completing transcription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete transcription" },
      { status: 500 }
    );
  }
}

