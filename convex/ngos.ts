import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllNgos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ngos").collect();
  },
});

export const getNgosByIntent = query({
  args: { intent: v.string() },
  handler: async (ctx, args) => {
    const allNgos = await ctx.db.query("ngos").collect();
    return allNgos.filter(ngo => 
      ngo.specialties.includes(args.intent) && ngo.isActive
    );
  },
});

export const initializeNgos = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if NGOs already exist
    const existingNgos = await ctx.db.query("ngos").collect();
    if (existingNgos.length > 0) return;

    const ngos = [
      {
        name: "Helping Hands Foundation",
        location: "Mumbai",
        specialties: ["FOOD", "SHELTER"],
        contact: "+91-9876543210",
        isActive: true,
      },
      {
        name: "Uday Foundation",
        location: "Delhi",
        specialties: ["SAFETY", "DOCUMENT"],
        contact: "+91-9876543211",
        isActive: true,
      },
      {
        name: "Care & Cure NGO",
        location: "Chennai",
        specialties: ["MEDICAL", "FOOD"],
        contact: "+91-9876543212",
        isActive: true,
      },
      {
        name: "Shelter Plus",
        location: "Bangalore",
        specialties: ["SHELTER", "SAFETY"],
        contact: "+91-9876543213",
        isActive: true,
      },
      {
        name: "Document Aid Society",
        location: "Kolkata",
        specialties: ["DOCUMENT", "SAFETY"],
        contact: "+91-9876543214",
        isActive: true,
      },
      {
        name: "Emergency Response Team",
        location: "Hyderabad",
        specialties: ["MEDICAL", "SAFETY"],
        contact: "+91-9876543215",
        isActive: true,
      },
      {
        name: "Food For All",
        location: "Pune",
        specialties: ["FOOD"],
        contact: "+91-9876543216",
        isActive: true,
      },
      {
        name: "Safe Haven Trust",
        location: "Ahmedabad",
        specialties: ["SHELTER", "SAFETY"],
        contact: "+91-9876543217",
        isActive: true,
      },
    ];

    for (const ngo of ngos) {
      await ctx.db.insert("ngos", ngo);
    }
  },
});
