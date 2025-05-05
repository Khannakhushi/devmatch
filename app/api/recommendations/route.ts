import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Check configuration and initialize the OpenAI model
const apiKey = process.env.OPENAI_API_KEY;
const openAIModel = apiKey ? openai("gpt-4.1-nano") : null;

// Define interfaces for response structure
interface TechRecommendation {
  name: string;
  description: string;
}

interface RecommendationData {
  frontend: TechRecommendation[];
  backend: TechRecommendation[];
  database: TechRecommendation[];
  cloud: TechRecommendation[];
  projectIdeas: TechRecommendation[];
  rawText?: string;
}

export async function POST(req: Request) {
  // Check if API key is configured
  if (!apiKey) {
    console.error("OpenAI API key not configured");
    return new Response(
      JSON.stringify({
        error: "API key not configured",
        details: "Please set the OPENAI_API_KEY environment variable",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (!openAIModel) {
    console.error("Failed to initialize OpenAI model");
    return new Response(
      JSON.stringify({
        error: "Failed to initialize AI model",
        details:
          "The OpenAI model could not be initialized. Check your API key and try again.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Parse the request body
    const { techStack } = await req.json();

    if (!techStack || !Array.isArray(techStack) || techStack.length === 0) {
      return new Response(
        JSON.stringify({ error: "Valid techStack array is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create a prompt for OpenAI based on the tech stack
    const prompt = `
      I'm a developer who likes the following technologies: ${techStack.join(
        ", "
      )}.
      
      Based on my technology preferences, provide HIGHLY CONTEXTUALLY RELEVANT recommendations that match my specific domain and interests. The recommendations must be tailored to the exact technologies I've selected, not generic suggestions.
      
      First, carefully analyze my selected technologies to identify:
      - The primary domain (e.g., web development, mobile dev, data science, DevOps, etc.)
      - The specific ecosystem (e.g., React ecosystem, iOS/Swift development, Python data stack)
      - My apparent experience level based on technology choices
      - Any clear gaps in my current stack that need to be filled
      
      Then provide specialized recommendations in these categories:
      
      1. Frontend: If I've selected any MOBILE technologies like Swift/iOS or React Native, recommend mobile-specific UI frameworks, design tools and libraries that pair well. If I've selected web technologies, suggest complementary frontend tools for that specific ecosystem.
      
      2. Backend: Recommend backend technologies that DIRECTLY integrate with my chosen frontend/mobile stack. For mobile devs, focus on mobile-specific backend services (e.g., CloudKit for iOS). For web devs, recommend backends that match their language preferences.
      
      3. Database: Suggest databases that have first-class support and strong integration with my specific stack, not generic recommendations. For mobile, include mobile-specific databases if relevant.
      
      4. Cloud: Recommend deployment/cloud solutions that are OPTIMIZED for my specific stack (e.g., App Store deployment for iOS, specialized hosting for specific web frameworks).
      
      5. Project Ideas: Suggest EXACTLY 2 realistic, domain-specific projects that would leverage my exact technology choices. For mobile devs, suggest mobile app ideas. For web devs, suggest web applications. The ideas should showcase the strengths of my specific stack choices.
      
      Ensure your recommendations are:
      - HIGHLY SPECIALIZED to my exact technology choices (not generic suggestions)
      - Contextually relevant to the specific domain of my selected technologies
      - Modern but well-established with good documentation
      - Missing from my current selections (don't recommend technologies I've already picked)
      - Actually used together in real-world production by companies
      
      Format your response as a structured JSON object with these exact keys:
      {
        "frontend": [
          { 
            "name": "Technology Name", 
            "description": "Brief explanation highlighting how it complements my specific stack and why it's a good fit (1-2 sentences max)",
            "resources": [
              { "name": "Resource Name", "url": "Resource URL", "type": "documentation|tutorial|course|community" },
              { "name": "Another Resource", "url": "Resource URL", "type": "documentation|tutorial|course|community" }
            ]
          }
        ],
        "backend": [
          { 
            "name": "Technology Name", 
            "description": "Brief explanation highlighting how it complements my specific stack and why it's a good fit (1-2 sentences max)",
            "resources": [
              { "name": "Resource Name", "url": "Resource URL", "type": "documentation|tutorial|course|community" },
              { "name": "Another Resource", "url": "Resource URL", "type": "documentation|tutorial|course|community" }
            ]
          }
        ],
        "database": [
          { 
            "name": "Technology Name", 
            "description": "Brief explanation highlighting how it complements my specific stack and why it's a good fit (1-2 sentences max)",
            "resources": [
              { "name": "Resource Name", "url": "Resource URL", "type": "documentation|tutorial|course|community" },
              { "name": "Another Resource", "url": "Resource URL", "type": "documentation|tutorial|course|community" }
            ]
          }
        ],
        "cloud": [
          { 
            "name": "Technology Name", 
            "description": "Brief explanation highlighting how it complements my specific stack and why it's a good fit (1-2 sentences max)",
            "resources": [
              { "name": "Resource Name", "url": "Resource URL", "type": "documentation|tutorial|course|community" },
              { "name": "Another Resource", "url": "Resource URL", "type": "documentation|tutorial|course|community" }
            ]
          }
        ],
        "projectIdeas": [
          { "name": "Project Name", "description": "Concise description of a realistic project that fully utilizes my specific technology choices (2-3 sentences max)" },
          { "name": "Project Name", "description": "Concise description of a realistic project that fully utilizes my specific technology choices (2-3 sentences max)" }
        ]
      }
      
      Return ONLY the JSON object with no explanatory text or code blocks.
    `;

    // Use generateText
    const { text } = await generateText({
      model: openAIModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      maxTokens: 1500,
    });

    console.log("Raw API response:", text);

    // Extract JSON from the response
    let responseData: RecommendationData;
    try {
      // First, try direct JSON parsing
      responseData = JSON.parse(text.trim()) as RecommendationData;
      console.log("Successfully parsed direct JSON response");
    } catch (parseError) {
      console.log("Direct parsing failed:", parseError);
      console.log("Trying to extract JSON from text...");

      try {
        // Remove any "```json" and "```" markers
        const cleanedText = text.replace(/```json\s+|\s+```|```/g, "");
        // Try parsing the cleaned text
        responseData = JSON.parse(cleanedText.trim()) as RecommendationData;
        console.log("Successfully parsed cleaned JSON");
      } catch (cleanError) {
        console.log("Cleaned parsing failed:", cleanError);

        // Look for JSON within the text using regex
        try {
          // Pattern to extract content between JSON code blocks or any JSON-like structure
          const jsonPattern = /{[\s\S]*?}/;
          const match = text.match(jsonPattern);

          if (match && match[0]) {
            // Try to parse the extracted JSON
            responseData = JSON.parse(match[0]) as RecommendationData;
            console.log("Successfully extracted and parsed JSON with regex");
          } else {
            throw new Error("No JSON pattern found in the response");
          }
        } catch (extractError) {
          console.error("JSON extraction failed:", extractError);

          // Provide the raw text as fallback
          responseData = {
            frontend: [],
            backend: [],
            database: [],
            cloud: [],
            projectIdeas: [],
            rawText: text,
          };
        }
      }
    }

    // Ensure each section exists and is an array
    responseData.frontend = Array.isArray(responseData.frontend)
      ? responseData.frontend
      : [];
    responseData.backend = Array.isArray(responseData.backend)
      ? responseData.backend
      : [];
    responseData.database = Array.isArray(responseData.database)
      ? responseData.database
      : [];
    responseData.cloud = Array.isArray(responseData.cloud)
      ? responseData.cloud
      : [];
    responseData.projectIdeas = Array.isArray(responseData.projectIdeas)
      ? responseData.projectIdeas
      : [];

    // Fix projectIdeas format if needed
    responseData.projectIdeas = responseData.projectIdeas.map(
      (item: TechRecommendation | string) => {
        // If projectIdea is already an object with name and description, keep it
        if (
          typeof item === "object" &&
          item !== null &&
          "name" in item &&
          "description" in item
        ) {
          return item as TechRecommendation;
        }
        // If it's a string, convert it to the proper format
        if (typeof item === "string") {
          const parts = item.split(": ");
          return {
            name: parts.length > 1 ? parts[0] : "Project Idea",
            description: item,
          };
        }
        // Default fallback
        return {
          name: "Project Idea",
          description: "A project using your selected technologies.",
        };
      }
    );

    console.log("Final processed data:", JSON.stringify(responseData, null, 2));

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in OpenAI API:", error);

    // Determine if this is an API key error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isApiKeyError =
      errorMessage.toLowerCase().includes("api key") ||
      errorMessage.toLowerCase().includes("authentication") ||
      errorMessage.toLowerCase().includes("auth");

    return new Response(
      JSON.stringify({
        error: isApiKeyError
          ? "API key error"
          : "Failed to generate recommendations",
        details: errorMessage,
        suggestion: isApiKeyError
          ? "Please check that your OpenAI API key is valid and properly configured"
          : "Try again later or with different technologies",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
