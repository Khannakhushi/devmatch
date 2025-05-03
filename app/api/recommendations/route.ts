import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Check configuration and initialize the OpenAI model
const apiKey = process.env.OPENAI_API_KEY;
const openAIModel = apiKey ? openai("gpt-4o-mini") : null;

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
      
      Based on these preferences, provide me with recommendations for the following categories only:
      1. Frontend: Complementary frontend technologies that would pair well with my current stack
      2. Backend: Backend technologies and frameworks to consider
      3. Database: Database options that would work well with my selected technologies
      4. Cloud: Cloud platforms and deployment options for my stack
      
      Format your response as a structured JSON object with these exact keys: 
      {
        "frontend": [array of 3-5 technology recommendations with short descriptions],
        "backend": [array of 3-5 technology recommendations with short descriptions],
        "database": [array of 3-5 technology recommendations with short descriptions],
        "cloud": [array of 3-5 technology recommendations with short descriptions],
        "projectIdeas": [array of 2-3 project ideas that combine these technologies]
      }
      
      Each technology recommendation should include a "name" and "description" property. 
      Each project idea should also follow the format { "name": "Project Name", "description": "Description of the project" }.
      Do not include any markdown formatting like code blocks, just return a clean JSON object.
    `;

    // Use generateText
    const { text } = await generateText({
      model: openAIModel,
      messages: [{ role: "user", content: prompt }],
    });

    console.log("Raw API response:", text);

    // Extract JSON from the response
    // First try direct JSON parsing
    let responseData: RecommendationData;
    try {
      responseData = JSON.parse(text) as RecommendationData;
      console.log("Successfully parsed direct JSON response");
    } catch (parseError) {
      console.log("Direct parsing failed:", parseError);
      console.log("Trying to extract JSON from text...");

      // Look for JSON within the text (removing any markdown code blocks)
      try {
        // Pattern to extract content between JSON code blocks
        const jsonPattern = /```(?:json)?\s*({[\s\S]*?})\s*```/;
        const match = text.match(jsonPattern);

        if (match && match[1]) {
          // Try to parse the extracted JSON
          responseData = JSON.parse(match[1]) as RecommendationData;
          console.log("Successfully extracted and parsed JSON from markdown");
        } else {
          // Try to find any JSON object in the text
          const possibleJson = text.match(/{[\s\S]*?}/);
          if (possibleJson) {
            responseData = JSON.parse(possibleJson[0]) as RecommendationData;
            console.log("Found and parsed JSON object in text");
          } else {
            throw new Error("No JSON pattern found in the response");
          }
        }
      } catch (extractError) {
        console.error("JSON extraction failed:", extractError);
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

    // Fix projectIdeas format if needed
    if (responseData.projectIdeas && Array.isArray(responseData.projectIdeas)) {
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
            return {
              name: item.split(":")[0] || "Project Idea",
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
    }

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
