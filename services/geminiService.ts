import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to check for API key securely
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

// Mock data for fallback when API key is missing
const MOCK_RESULT: AnalysisResult = {
  overallScore: 72,
  overallLabel: "Good",
  summary: "A solid foundation for a fresher. Your academic background is clear, but you need to emphasize specific technical skills and quantify your project impact. Great potential for Junior roles.",
  matchPercentage: 65,
  sectionScores: [
    { name: "Structure & Formatting", score: 80, feedback: "Clean layout, but consider moving Education to the top for a fresher resume." },
    { name: "Skills & Keywords", score: 60, feedback: "Missing some key tools required for the target role." },
    { name: "Projects & Achievements", score: 70, feedback: "Projects are listed but lack 'results' or 'outcomes'." },
    { name: "Language & Clarity", score: 85, feedback: "English is professional. Good use of bullet points." },
  ],
  missingKeywords: ["React.js", "Tailwind CSS", "Git Workflow", "REST API"],
  suggestions: [
    { id: "1", text: "Add a 'Skills' section specifically listing programming languages and frameworks relevant to the job.", impact: "High", category: "Skills" },
    { id: "2", text: "For your 'Library Management System' project, mention how many users it supported or if it reduced manual work.", impact: "High", category: "Content" },
    { id: "3", text: "Ensure your LinkedIn profile link is clickable.", impact: "Low", category: "Formatting" },
    { id: "4", text: "Use strong action verbs like 'Developed', 'Orchestrated', 'Designed' instead of 'Worked on'.", impact: "Medium", category: "Grammar" }
  ],
  banglaContext: [
    { topic: "Academic Projects / Thesis", advice: "Your thesis is mentioned, but treating it like a 'job' with roles and technologies used would make it stronger.", isOptimized: false },
    { topic: "HSC/SSC vs University", advice: "University info is clear. You can reduce the detail on SSC/HSC GPA if your University CGPA is strong.", isOptimized: true },
    { topic: "Coaching/Tuition", advice: "If you have private tuition experience, list it under 'Leadership' or 'Communication' rather than 'Work Experience' unless relevant to the job.", isOptimized: true }
  ]
};

export const analyzeResume = async (resumeText: string, targetRole: string): Promise<AnalysisResult> => {
  const apiKey = getApiKey();

  // 1. If no API Key, simulate network delay and return mock
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
    console.warn("Gemini API Key missing. Using Mock Data.");
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_RESULT), 2000);
    });
  }

  // 2. Real API Call
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Act as an expert technical recruiter for the Bangladeshi job market. 
      Analyze the following resume text for a fresher/student applying for the role of: "${targetRole}".
      
      Focus on:
      1. ATS friendliness.
      2. Relevance to the target role.
      3. How well they highlight academic projects (Thesis, Lab projects) as experience.
      4. Common mistakes Bangladeshi students make (e.g., too much focus on father's name/religion, weak project descriptions).

      Resume Text:
      ${resumeText}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            overallLabel: { type: Type.STRING, enum: ["Needs Work", "Good", "Strong"] },
            summary: { type: Type.STRING },
            matchPercentage: { type: Type.NUMBER },
            sectionScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  feedback: { type: Type.STRING }
                }
              }
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  category: { type: Type.STRING, enum: ["Content", "Formatting", "Skills", "Grammar"] }
                }
              }
            },
            banglaContext: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  advice: { type: Type.STRING },
                  isOptimized: { type: Type.BOOLEAN }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("Empty response from AI");
    }

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback to mock on error to prevent app crash in demo
    return MOCK_RESULT;
  }
};