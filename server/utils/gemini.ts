import { GoogleGenerativeAI } from "@google/generative-ai";
import { Lecture } from "@shared/types";

// Initialize Gemini API with the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Map grade level to appropriate language complexity
const gradeComplexity: Record<string, string> = {
  "1": "very simple with short sentences and basic vocabulary suitable for 6-7 year old children",
  "2": "simple with basic vocabulary and slightly longer sentences suitable for 7-8 year old children",
  "3": "moderately simple with age-appropriate vocabulary for 8-9 year old children",
  "4": "moderately complex with some specialized vocabulary suitable for 9-10 year old children",
  "5": "slightly more complex with appropriate vocabulary and concepts for 10-11 year old children"
};

// Generate lecture content for a given topic and grade
export async function generateLecture(topic: string, grade: string): Promise<Lecture> {
  try {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const complexity = gradeComplexity[grade] || gradeComplexity["3"];
    const gradeText = grade === "1" ? "1st" : grade === "2" ? "2nd" : grade === "3" ? "3rd" : `${grade}th`;
    
    const prompt = `
      You are an experienced elementary school teacher creating a lecture for ${gradeText} grade students about "${topic}".
      
      Create an educational, engaging, and informative lecture that is ${complexity}.
      
      Include the following in your response as a structured HTML:
      
      1. A title for the lecture (formatted as an H1)
      2. A brief subtitle that makes the subject interesting
      3. The main content with:
         - Clear headings (H2) and subheadings (H3) to organize content
         - Simple explanations with age-appropriate examples
         - Bullet points or numbered lists where appropriate
         - 2-3 fun facts or interesting information in highlighted boxes
         - A simple activity or experiment kids can try related to the topic
         - 3-4 simple quiz questions with answers
      
      Format your response as valid HTML that can be inserted directly into a webpage.
      Do not include <!DOCTYPE>, <html>, <head>, or <body> tags.
      Use <div> with appropriate classes for highlighted boxes and activities.
      For fun fact boxes, use: <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg">
      For activity boxes, use: <div class="bg-green-50 border border-green-200 rounded-lg p-5 my-6">
      For quiz questions, use: <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
      
      Keep the content engaging, educational, and appropriate for ${gradeText} grade students.
    `;

    // Generate content using Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    // Extract title and subtitle from content
    let title = `${topic} for ${gradeText} Graders`;
    let subtitle = `Learn about ${topic}!`;
    
    // Try to extract title and subtitle from the HTML content
    const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }
    
    const subtitleMatch = content.match(/<p[^>]*>(.*?)<\/p>/i);
    if (subtitleMatch && subtitleMatch[1]) {
      subtitle = subtitleMatch[1].trim();
    }
    
    // Return formatted lecture
    return {
      title,
      subtitle,
      content,
      gradeLevel: grade,
      topic
    };
  } catch (error) {
    console.error("Error generating lecture with Gemini:", error);
    throw new Error("Failed to generate lecture content. Please try again.");
  }
}
