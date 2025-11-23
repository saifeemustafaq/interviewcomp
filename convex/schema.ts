import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  transcriptions: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    title: v.string(),
    transcript: v.string(),
    status: v.union(v.literal("active"), v.literal("completed")),
    startedAt: v.number(), // Unix timestamp
    completedAt: v.optional(v.number()),
    lastUpdated: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_status", ["status"])
    .index("by_startedAt", ["startedAt"]),
});

