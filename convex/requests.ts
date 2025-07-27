import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const getAllRequests = query({
  handler: async (ctx) => {
    return await ctx.db.query("requests").order("desc").collect();
  },
});

export const getPendingRequests = query({
  handler: async (ctx) => {
    return await ctx.db.query("requests").withIndex("by_status", q => q.eq("status", "pending")).order("desc").collect();
  },
});

export const getAnalytics = query({
  handler: async (ctx) => {
    const requests = await ctx.db.query("requests").collect();
    const totalRequests = requests.length;
    const intentCounts = requests.reduce((acc, req) => {
      acc[req.intent] = (acc[req.intent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const locationCounts = requests.reduce((acc, req) => {
        acc[req.location] = (acc[req.location] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topCities = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      totalRequests,
      intentCounts,
      topCities,
    };
  },
});

export const assignRequestToNgo = mutation({
  args: {
    requestId: v.id("requests"),
    ngoName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.requestId, {
      assignedNgo: args.ngoName,
      status: "assigned",
    });
  },
});

export const markRequestResolved = mutation({
  args: {
    requestId: v.id("requests"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.requestId, {
      status: "resolved",
    });
  },
});

// New mutation to create a request from a scripted call
export const createRequestFromCall = mutation({
    args: {
        callerId: v.string(),
        conversation: v.array(v.object({
            speaker: v.string(),
            message: v.string(),
            timestamp: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        // This is a simplified version. In a real app, you'd use an action 
        // to call an AI to extract this information from the conversation.
        const voiceInput = args.conversation.find(c => c.speaker === 'victim')?.message || "N/A";
        
        let intent = "UNKNOWN";
        let priority = "medium";
        if (voiceInput.toLowerCase().includes("chest pain") || voiceInput.toLowerCase().includes("breathing")) {
            intent = "MEDICAL";
            priority = "critical";
        } else if (voiceInput.toLowerCase().includes("break into")) {
            intent = "SAFETY";
            priority = "high";
        } else if (voiceInput.toLowerCase().includes("flood") || voiceInput.toLowerCase().includes("shelter")) {
            intent = "SHELTER";
            priority = "high";
        }

        const requestId = await ctx.db.insert("requests", {
            callerId: args.callerId,
            voiceInput: voiceInput,
            location: "Unknown", // Location would be determined by AI in a real scenario
            intent: intent,
            status: "pending",
            priority: priority,
            conversation: args.conversation,
        });

        // You could still trigger auto-routing here if needed
        await ctx.scheduler.runAfter(0, internal.requests.autoRouteToNgo, {
            requestId: requestId,
            intent: intent,
            location: "Unknown",
            priority: priority,
        });

        return requestId;
    }
});

export const createVoiceRequest = internalMutation({
    args: {
        callerId: v.string(),
        voiceInput: v.string(),
        location: v.string(),
        coordinates: v.object({
            lat: v.number(),
            lng: v.number(),
        }),
        intent: v.string(),
        priority: v.string(),
        aiAnalysis: v.any(),
        conversation: v.array(v.object({
            speaker: v.string(),
            message: v.string(),
            timestamp: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("requests", {
            callerId: args.callerId,
            voiceInput: args.voiceInput,
            location: args.location,
            coordinates: args.coordinates,
            intent: args.intent,
            status: "pending",
            priority: args.priority,
            aiAnalysis: args.aiAnalysis,
            conversation: args.conversation,
        });
    }
});

export const autoRouteToNgo = internalMutation({
    args: {
        requestId: v.id("requests"),
        intent: v.string(),
        location: v.string(),
        priority: v.string(),
    },
    handler: async (ctx, args) => {
        const allNgos = await ctx.db.query("ngos").collect();

        const suitableNgos = allNgos.filter(ngo =>
            ngo.isActive &&
            ngo.location === args.location &&
            ngo.specialties.includes(args.intent)
        );

        if (suitableNgos.length > 0) {
            const assignedNgo = suitableNgos[0];
            await ctx.db.patch(args.requestId, {
                assignedNgo: assignedNgo.name,
                status: "assigned",
                autoAssigned: true,
            });
        }
    }
});
