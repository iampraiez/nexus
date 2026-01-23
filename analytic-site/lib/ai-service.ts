import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export interface AnalyticsReportData {
  companyName: string;
  totalEvents: number;
  activeUsers: number;
  topEvents: { name: string; count: number }[];
  recentErrors: number;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}

export async function generateAnalyticsReport(data: AnalyticsReportData): Promise<string> {
  if (!genAI) {
    return "AI generation is disabled because GEMINI_API_KEY is missing. Please configure it in your environment variables.";
  }

  const prompt = `
    You are an expert Chief Data Officer and Product Analyst for Nexus Analytics. 
    Your goal is to provide an "insanely comprehensive" and actionable executive intelligence report for "${data.companyName}" based on their analytics data for the ${data.period} period (${data.startDate} to ${data.endDate}).

    **Input Data:**
    - **Total Events:** ${data.totalEvents}
    - **Active Users:** ${data.activeUsers}
    - **Top Events:** ${data.topEvents.map(e => `${e.name} (${e.count})`).join(', ')}
    - **Recent Errors:** ${data.recentErrors}

    **Instructions:**
    Generate a deeply insightful report in Markdown format. Do not just summarize the numbers; explain *why* they matter and *what* the user should do next.
    
    **Report Structure:**
    
    # 📊 Executive Summary
    A high-level overview of the health of the application. Is it growing? Stagnating? Facing issues? Use professional but punchy language.

    # 🔍 Deep Dive Analysis
    - **User Engagement:** Analyze the active user count relative to total events. Are users highly engaged or just dropping in?
    - **Event Patterns:** Interpret the top events. What does the most frequent event tell us about user behavior? What's missing from the top list that *should* be there?
    - **System Health:** Analyze the error count. Is it acceptable? If high, what are the potential business impacts?

    # 💡 Strategic Recommendations
    Provide 3-5 specific, actionable steps to improve:
    1. **Growth:** How to acquire more users based on current trends.
    2. **Retention:** How to keep existing users engaged.
    3. **Technical Stability:** Immediate steps if errors are detected.

    # 🔮 Forward Outlook
    Predict potential future trends if current patterns continue.

    **Tone:** Professional, authoritative, yet encouraging. Use "I" as your dedicated AI analyst.
    **Formatting:** Use bolding, lists, and clear headings to make it readable.
  `;

  try {
    const result = await genAI!.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return result.text as any
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Failed to generate AI report");
  }
}
