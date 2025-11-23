import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query: Get all transcriptions
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("transcriptions")
      .withIndex("by_startedAt")
      .order("desc")
      .collect();
  },
});

// Query: Get active transcriptions
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("transcriptions")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();
  },
});

// Query: Get transcription by sessionId
export const getBySessionId = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transcriptions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

// Mutation: Create or update transcription from webhook
export const upsertFromWebhook = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    transcript: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if transcription exists
    const existing = await ctx.db
      .query("transcriptions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      // Update existing - only if still active
      if (existing.status === "active") {
        await ctx.db.patch(existing._id, {
          transcript: existing.transcript
            ? existing.transcript + " " + args.transcript
            : args.transcript,
          lastUpdated: now,
        });
        return existing._id;
      } else {
        // Already completed, don't update
        return existing._id;
      }
    } else {
      // Create new transcription
      const newId = await ctx.db.insert("transcriptions", {
        sessionId: args.sessionId,
        userId: args.userId,
        title: args.title || `Transcription ${args.sessionId}`,
        transcript: args.transcript,
        status: "active",
        startedAt: now,
        lastUpdated: now,
      });
      return newId;
    }
  },
});

// Mutation: Complete/stop a transcription
export const complete = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const transcription = await ctx.db
      .query("transcriptions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!transcription) {
      throw new Error("Transcription not found");
    }

    if (transcription.status === "completed") {
      return transcription._id; // Already completed
    }

    const now = Date.now();
    await ctx.db.patch(transcription._id, {
      status: "completed",
      completedAt: now,
      lastUpdated: now,
    });

    return transcription._id;
  },
});

// Mutation: Delete a transcription
export const remove = mutation({
  args: { id: v.id("transcriptions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

