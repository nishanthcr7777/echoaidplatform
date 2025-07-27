"use node";

// Force re-deploy
import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const indianCities: Record<string, { lat: number; lng: number }> = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
};
const cityNames = Object.keys(indianCities);

export const processInitialCall = action({
  args: {
    victimStatement: v.string(),
  },
  handler: async (ctx, args): Promise<{
    intent: string;
    priority: string;
    location: string;
    aiQuestion: string;
    plausibleVictimAnswer: string;
  }> => {
    const analysisPrompt = `
      You are an emergency response AI. Analyze this initial statement from a distressed caller.
      Statement: "${args.victimStatement}"

      1.  Determine the primary "intent" (FOOD, SHELTER, SAFETY, MEDICAL, DOCUMENT).
      2.  Determine the "priority" (low, medium, high, critical).
      3.  Extract the "location" if mentioned, otherwise pick one randomly from this list: ${cityNames.join(", ")}.
      4.  Based on the intent, formulate a single, concise, empathetic question to gather more critical information.
      5.  Based on the question, generate a plausible, short, distressed response the victim might give.

      Respond ONLY in JSON format:
      {
        "intent": "...",
        "priority": "...",
        "location": "...",
        "aiQuestion": "...",
        "plausibleVictimAnswer": "..."
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: analysisPrompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result;
  },
});

export const getFinalResponseAndCreateRequest = action({
  args: {
    conversation: v.array(v.object({
      speaker: v.string(),
      message: v.string(),
      timestamp: v.number(),
    })),
    callerId: v.string(),
  },
  handler: async (ctx, args): Promise<{
    finalAiResponse: string;
    requestId: Id<"requests">;
  }> => {
    const fullTranscript = args.conversation.map(c => `${c.speaker}: ${c.message}`).join("\n");

    const finalAnalysisPrompt = `
      You are an emergency response AI. You have the full transcript of a call.
      Transcript:
      ${fullTranscript}

      1.  Analyze the full conversation to get the final details.
      2.  Create a brief "summary" of the situation.
      3.  Determine the final "intent", "priority", and "location".
      4.  Formulate a final, reassuring, and professional response to the caller, confirming that help has been dispatched. Mention the type of help (e.g., "medical team", "local shelter partner").
      5.  List key "urgencyIndicators" and "immediateActions" taken.

      Respond ONLY in JSON format:
      {
        "summary": "...",
        "intent": "...",
        "priority": "...",
        "location": "...",
        "finalAiResponse": "...",
        "aiAnalysis": {
            "emotionalState": "...",
            "urgencyIndicators": ["..."],
            "immediateActions": ["..."]
        }
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: finalAnalysisPrompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    const locationName = result.location;
    const coordinates = indianCities[locationName] || { lat: 20.5937, lng: 78.9629 }; // Default to India center

    const requestId: Id<"requests"> = await ctx.runMutation(internal.requests.createVoiceRequest, {
      callerId: args.callerId,
      voiceInput: args.conversation.find(c => c.speaker === 'victim')?.message || "N/A",
      location: locationName,
      coordinates,
      intent: result.intent,
      priority: result.priority,
      aiAnalysis: { ...result.aiAnalysis, summary: result.summary },
      conversation: args.conversation,
    });

    await ctx.runMutation(internal.requests.autoRouteToNgo, {
      requestId: requestId,
      intent: result.intent,
      location: locationName,
      priority: result.priority,
    });

    return {
      finalAiResponse: result.finalAiResponse,
      requestId,
    };
  },
});
