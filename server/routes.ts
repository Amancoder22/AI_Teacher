import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateLecture } from "./utils/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for generating lectures
  app.post("/api/lectures/generate", async (req, res) => {
    try {
      const { topic, grade } = req.body;
      
      if (!topic || !grade) {
        return res.status(400).json({ message: "Topic and grade are required" });
      }
      
      // Validate grade is between 1-5
      const gradeNumber = parseInt(grade);
      if (isNaN(gradeNumber) || gradeNumber < 1 || gradeNumber > 5) {
        return res.status(400).json({ message: "Grade must be between 1 and 5" });
      }
      
      // Generate lecture using Gemini API
      const lecture = await generateLecture(topic, grade);
      
      return res.status(200).json(lecture);
    } catch (error) {
      console.error("Error generating lecture:", error);
      return res.status(500).json({ 
        message: "Failed to generate lecture. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
