import { NextRequest, NextResponse } from "next/server";

/**
 * OMI Webhook Endpoint - Real-Time Transcript Processor
 * 
 * This endpoint receives real-time transcription data from OMI device.
 * Based on official OMI documentation: https://docs.omi.me/doc/developer/apps/Integrations
 * 
 * To configure in OMI:
 * 1. Open OMI app on your device
 * 2. Navigate to Settings > Developer Mode
 * 3. Go to Developer Settings
 * 4. Set "Real-Time Transcript Webhook" URL to: https://yourdomain.com/api/omi/webhook
 * 
 * OMI sends data in this format:
 * POST /api/omi/webhook?session_id={session_id}&uid={user_id}
 * {
 *   "session_id": "abc123",
 *   "segments": [
 *     {
 *       "text": "Hello, how can I help you?",
 *       "speaker": "assistant",
 *       "is_user": false
 *     },
 *     {
 *       "text": "I need help with...",
 *       "speaker": "user",
 *       "is_user": true
 *     }
 *   ]
 * }
 * 
 * Note: session_id and uid are sent as query parameters, not in the body.
 */
export async function POST(request: NextRequest) {
  try {
    // Extract query parameters (OMI sends session_id and uid as query params)
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const userId = searchParams.get("uid");

    // Parse request body
    const body = await request.json();
    
    // OMI Real-Time Transcript Processor payload structure
    const {
      session_id: bodySessionId, // May also be in body
      segments = [], // Array of transcript segments
    } = body;

    // Use session_id from query param (preferred) or body
    const activeSessionId = sessionId || bodySessionId;

    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid segments array" },
        { status: 400 }
      );
    }

    // Process segments and combine text
    // Filter for user speech (is_user: true) or process all segments
    const userSegments = segments.filter((seg: any) => seg.is_user === true);
    const allText = segments.map((seg: any) => seg.text).join(" ");
    const userText = userSegments.map((seg: any) => seg.text).join(" ");

    // Use user text if available, otherwise use all text
    const transcript = userText || allText;

    // Store transcription in Convex (if available) or fallback to in-memory store
    let storedInConvex = false;
    try {
      // Try Convex first (if environment variable is set)
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (convexUrl) {
        // Forward to Convex HTTP action
        const convexSiteUrl = convexUrl.replace('.cloud', '.site');
        const webhookUrl = `${convexSiteUrl}/api/http/omiWebhook?session_id=${encodeURIComponent(activeSessionId || '')}&uid=${encodeURIComponent(userId || '')}`;
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: activeSessionId,
            segments: segments,
          }),
        });
        
        if (response.ok) {
          storedInConvex = true;
          console.log("✅ Successfully stored in Convex");
        } else {
          const errorText = await response.text();
          console.error(`Convex webhook returned ${response.status}:`, errorText);
        }
      }
    } catch (convexError) {
      console.error("Error calling Convex webhook:", convexError);
    }
    
    // Fallback to in-memory store if Convex not available or failed
    if (!storedInConvex) {
      try {
        const { addOrUpdateTranscription } = await import("../../transcriptions/store");
        addOrUpdateTranscription({
          sessionId: activeSessionId || `session-${Date.now()}`,
          transcript,
          status: "active",
          title: `OMI Transcription ${activeSessionId || "New"}`,
        });
        console.log("📦 Stored in fallback in-memory store");
      } catch (fallbackError) {
        console.error("Error storing in fallback:", fallbackError);
      }
    }

    console.log("OMI Webhook received:", {
      sessionId: activeSessionId,
      userId: userId,
      segmentCount: segments.length,
      transcriptPreview: transcript.substring(0, 100) + "...",
      totalTextLength: transcript.length,
    });

    // Return HTTP 200 within 2 seconds (OMI requirement)
    // OMI will retry if response is not 200 or takes too long
    return NextResponse.json(
      { 
        success: true, 
        message: "Transcription received",
        session_id: activeSessionId,
        segments_processed: segments.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing OMI webhook:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

// Handle GET requests for webhook verification (if OMI requires it)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: "OMI Webhook endpoint is active" },
    { status: 200 }
  );
}

