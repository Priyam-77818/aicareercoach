"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateAIInsights = async (industry) => {
  if (!industry) throw new Error("Industry is required for AI insights");

  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Clean the text (remove markdown code fences)
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  try {
    const parsed = JSON.parse(cleanedText);

    // Ensure arrays are arrays
    parsed.topSkills = Array.isArray(parsed.topSkills) ? parsed.topSkills : [];
    parsed.keyTrends = Array.isArray(parsed.keyTrends) ? parsed.keyTrends : [];
    parsed.recommendedSkills = Array.isArray(parsed.recommendedSkills)
      ? parsed.recommendedSkills
      : [];
    parsed.salaryRanges = Array.isArray(parsed.salaryRanges) ? parsed.salaryRanges : [];

    return parsed;
  } catch (error) {
    console.error("Failed to parse AI response JSON:", cleanedText);
    throw new Error("Invalid AI response format");
  }
};

// Function to get or generate industry insights
export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");
  if (!user.industry) throw new Error("User has no industry assigned");

  // If no insights exist, generate and save them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.upsert({
  where: { industry: user.industry },
  update: {
    salaryRanges: insights.salaryRanges,
    growthRate: insights.growthRate,
    demandLevel: insights.demandLevel,
    topSkills: insights.topSkills,
    marketOutlook: insights.marketOutlook,
    keyTrends: insights.keyTrends,
    recommendedSkills: insights.recommendedSkills,
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  create: {
    industry: user.industry,
    salaryRanges: insights.salaryRanges,
    growthRate: insights.growthRate,
    demandLevel: insights.demandLevel,
    topSkills: insights.topSkills,
    marketOutlook: insights.marketOutlook,
    keyTrends: insights.keyTrends,
    recommendedSkills: insights.recommendedSkills,
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});

    return industryInsight;
  }

  return user.industryInsight;
}
