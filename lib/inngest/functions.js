import { inngest } from "./client";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  {
    id: "generate-industry-insights",
    name: "Generate Industry Insights",
    triggers: [{ cron: "0 0 * * 0" }], // Every Sunday at midnight
  },
  async ({ step }) => {
    const industries = await step.run("fetch-industries", async () => {
      return await db.industryInsight.findMany({
        where: {
          nextUpdate: { lte: new Date() },
        },
      });
    });

    for (const industry of industries) {
      const insights = await step.run(
        `generate-insights-${industry.industry}`,
        async () => {
          const prompt = `
            Analyze the current state of the ${industry.industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
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
          const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
          return JSON.parse(cleanedText);
        }
      );

      await step.run(`update-industry-${industry.industry}`, async () => {
        await db.industryInsight.update({
          where: { industry: industry.industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }

    return { updated: industries.length };
  }
);
