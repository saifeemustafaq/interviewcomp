import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// HTTP Action for OMI webhook
http.route({
  path: "/omiWebhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Extract query parameters
      const url = new URL(request.url);
      const sessionId = url.searchParams.get("session_id");
      const userId = url.searchParams.get("uid");

      // Parse request body
      const body = await request.json();
      const {
        session_id: bodySessionId,
        segments = [],
      } = body;

      const activeSessionId = sessionId || bodySessionId;

      if (!segments || !Array.isArray(segments) || segments.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing or invalid segments array" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Process segments
      const userSegments = segments.filter((seg: any) => seg.is_user === true);
      const allText = segments.map((seg: any) => seg.text).join(" ");
      const userText = userSegments.map((seg: any) => seg.text).join(" ");
      const transcript = userText || allText;

      if (!activeSessionId) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing session_id" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Store in Convex
      await ctx.runMutation(api.transcriptions.upsertFromWebhook, {
        sessionId: activeSessionId,
        userId: userId || undefined,
        transcript,
        title: `OMI Transcription ${activeSessionId}`,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Transcription received",
          session_id: activeSessionId,
          segments_processed: segments.length,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error: any) {
      console.error("Error processing OMI webhook:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// Export the router as default
export default http;

