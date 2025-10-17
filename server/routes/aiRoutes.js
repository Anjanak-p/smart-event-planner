import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Initialize Gemini with error handling
let genAI;
let model;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("✅ Gemini AI initialized successfully");
  } else {
    console.warn("⚠️ GEMINI_API_KEY not found in environment variables");
  }
} catch (error) {
  console.error("❌ Error initializing Gemini:", error);
}

router.post("/suggest", async (req, res) => {
  try {
    const { type, guests, budget, location, theme } = req.body;
    console.log("📨 Received AI request:", { type, guests, budget, location, theme });

    // Validate required fields
    if (!type || !guests || !budget) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: type, guests, and budget are required"
      });
    }

    // If Gemini is not configured, return mock response
    if (!genAI || !model) {
      console.log("🤖 Using mock AI response (Gemini not configured)");
      const mockSuggestions = {
        wedding: `**Wedding Planning Suggestions**\n\n**Theme:** Romantic Garden\n**Guests:** ${guests}\n**Budget:** ₹${budget}\n\n**Checklist:**\n1. Book venue (40% of budget)\n2. Catering for ${guests} guests\n3. Photography & Videography\n4. Decorations and flowers\n5. Music and entertainment\n\n**Timeline:**\n- 6 months before: Book venue\n- 3 months: Send invitations\n- 1 month: Finalize menu\n- 2 weeks: Confirm vendors`,
        birthday: `**Birthday Party Suggestions**\n\n**Theme:** Celebration Time\n**Guests:** ${guests}\n**Budget:** ₹${budget}\n\n**Checklist:**\n1. Venue decoration\n2. Cake and food\n3. Games and activities\n4. Invitations\n5. Music and party favors\n\n**Budget Breakdown:**\n- Food: 40%\n- Decor: 20%\n- Entertainment: 20%\n- Miscellaneous: 20%`,
        corporate: `**Corporate Event Suggestions**\n\n**Theme:** Professional Networking\n**Guests:** ${guests}\n**Budget:** ₹${budget}\n\n**Checklist:**\n1. Conference venue booking\n2. Catering and refreshments\n3. Audio-visual equipment\n4. Guest speaker arrangements\n5. Networking activities\n\n**Schedule:**\n9:00 AM - Registration\n10:00 AM - Keynote\n1:00 PM - Lunch & Networking\n3:00 PM - Workshops\n5:00 PM - Closing`
      };

      const suggestion = mockSuggestions[type] || `Event planning suggestions for ${type} with ${guests} guests and budget of ₹${budget}. Consider venue booking, catering, decorations, and entertainment.`;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      return res.json({
        success: true,
        data: {
          suggestion: suggestion
        }
      });
    }

    // Use Gemini if available
    const prompt = `As an expert event planner, provide detailed suggestions for a ${type} event with ${guests} guests and a budget of ₹${budget}. ${
      location ? `Location preference: ${location}.` : ''
    } ${
      theme ? `Theme preference: ${theme}.` : ''
    }

Please provide:
1. Theme suggestions
2. Detailed checklist of tasks
3. Budget allocation breakdown
4. Timeline/schedule
5. Vendor recommendations

Format the response in a clear, organized way with sections.`;

    console.log("🚀 Sending request to Gemini...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini response received");

    res.json({
      success: true,
      data: {
        suggestion: text
      }
    });

  } catch (error) {
    console.error("❌ AI Route Error:", error);

    // Provide more specific error messages
    if (error.message?.includes('API_KEY_INVALID')) {
      return res.status(401).json({
        success: false,
        message: "Invalid Gemini API key. Please check your environment variables."
      });
    } else if (error.message?.includes('RATE_LIMIT_EXCEEDED') || error.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Gemini API rate limit exceeded. Please try again in a moment."
      });
    } else {
      return res.status(500).json({
        success: false,
        message: `AI service error: ${error.message}`
      });
    }
  }
});

// Add a test endpoint to check AI configuration
router.get("/test", (req, res) => {
  const config = {
    gemini_configured: !!(genAI && model),
    has_api_key: !!process.env.GEMINI_API_KEY,
    api_key_length: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
  };

  res.json({
    success: true,
    data: config
  });
});

export default router;
