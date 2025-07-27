import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  requests: defineTable({
    callerId: v.string(),
    voiceInput: v.string(),
    location: v.string(),
    coordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    intent: v.string(),
    status: v.string(), // "pending", "assigned", "resolved"
    assignedNgo: v.optional(v.string()),
    priority: v.string(), // "low", "medium", "high", "critical"
    aiAnalysis: v.optional(v.any()),
    autoAssigned: v.optional(v.boolean()),
    aiResponse: v.optional(v.string()),
    conversation: v.optional(v.array(v.object({
      speaker: v.string(),
      message: v.string(),
      timestamp: v.number(),
    })))
  }).index("by_status", ["status"])
    .index("by_intent", ["intent"])
    .index("by_location", ["location"])
    .index("by_priority", ["priority"]),

  ngos: defineTable({
    name: v.string(),
    location: v.string(),
    specialties: v.array(v.string()),
    contact: v.string(),
    isActive: v.boolean(),
    capacity: v.optional(v.number()),
    currentLoad: v.optional(v.number()),
  }),

  voiceCalls: defineTable({
    callerId: v.string(),
    audioUrl: v.optional(v.string()),
    transcript: v.string(),
    duration: v.number(),
    status: v.string(), // "active", "completed", "failed"
    requestId: v.optional(v.id("requests")),
  }),

  analytics: defineTable({
    date: v.string(),
    totalRequests: v.number(),
    intentCounts: v.object({
      FOOD: v.number(),
      SHELTER: v.number(),
      SAFETY: v.number(),
      MEDICAL: v.number(),
      DOCUMENT: v.number(),
    }),
    locationCounts: v.object({}),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
