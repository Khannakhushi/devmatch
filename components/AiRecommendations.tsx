import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon, Loader2Icon, AlertTriangleIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AiRecommendationsProps {
  likedTech: string[];
}

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

export default function AiRecommendations({
  likedTech,
}: AiRecommendationsProps) {
  const [recommendations, setRecommendations] =
    useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch recommendations
  const fetchRecommendations = useCallback(async (techList: string[]) => {
    if (!techList || techList.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching recommendations for:", techList);

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ techStack: techList }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI recommendations");
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (data) {
        setRecommendations(data);
      } else {
        throw new Error("No recommendations received");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );

      // Provide a fallback recommendation
      setRecommendations(generateFallbackRecommendation());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch recommendations when likedTech changes
  useEffect(() => {
    console.log("likedTech changed:", likedTech);
    if (likedTech && likedTech.length > 0) {
      fetchRecommendations(likedTech);
    }
  }, [likedTech, fetchRecommendations]);

  // Generate a fallback recommendation when the API fails
  const generateFallbackRecommendation = (): RecommendationData => {
    return {
      frontend: [
        {
          name: "React",
          description:
            "A popular JavaScript library for building user interfaces",
        },
        {
          name: "Next.js",
          description: "React framework with server-side rendering and routing",
        },
        {
          name: "Tailwind CSS",
          description: "Utility-first CSS framework for rapid UI development",
        },
      ],
      backend: [
        {
          name: "Node.js",
          description: "JavaScript runtime for server-side development",
        },
        {
          name: "Express",
          description: "Fast, unopinionated web framework for Node.js",
        },
        {
          name: "Spring Boot",
          description: "Java-based framework for building web applications",
        },
      ],
      database: [
        {
          name: "MongoDB",
          description: "NoSQL database for modern applications",
        },
        {
          name: "PostgreSQL",
          description: "Powerful, open-source object-relational database",
        },
        {
          name: "Redis",
          description:
            "In-memory data store used as database, cache, or message broker",
        },
      ],
      cloud: [
        {
          name: "AWS",
          description: "Comprehensive cloud platform with various services",
        },
        {
          name: "Vercel",
          description: "Platform for frontend frameworks and static sites",
        },
        {
          name: "Heroku",
          description: "Cloud platform for deploying and managing applications",
        },
      ],
      projectIdeas: [
        {
          name: "Task Management App",
          description:
            "Build a task management app with React, Express, and MongoDB",
        },
        {
          name: "Real-time Chat",
          description:
            "Create a real-time chat application with WebSockets and Redis",
        },
        {
          name: "Personal Blog",
          description:
            "Develop a personal blog with Next.js and a headless CMS",
        },
      ],
    };
  };

  // Render the recommendations in an organized way
  const renderRecommendations = () => {
    if (!recommendations) return null;

    // Fallback to raw text if structured data is missing
    if (
      recommendations.rawText &&
      !recommendations.frontend?.length &&
      !recommendations.backend?.length &&
      !recommendations.database?.length &&
      !recommendations.cloud?.length
    ) {
      return (
        <div className="prose prose-sm dark:prose-invert">
          {recommendations.rawText.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {renderCategorySection(
          "Frontend Technologies",
          recommendations.frontend
        )}
        {renderCategorySection("Backend Technologies", recommendations.backend)}
        {renderCategorySection("Database Options", recommendations.database)}
        {renderCategorySection("Cloud & Deployment", recommendations.cloud)}

        {recommendations.projectIdeas?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3">Project Ideas</h3>
            <div className="space-y-3">
              {recommendations.projectIdeas.map((project, index) => (
                <div key={index} className="p-3 rounded-md border bg-card">
                  <h4 className="font-semibold text-base">{project.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render a section for each category
  const renderCategorySection = (
    title: string,
    items?: TechRecommendation[]
  ) => {
    if (!items || items.length === 0) return null;

    return (
      <div>
        <h3 className="text-lg font-bold mb-3">{title}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="p-3 rounded-md border bg-card">
              <h4 className="font-semibold text-base">{item.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950">
              <SparklesIcon className="size-5" />
            </div>
            <CardTitle className="text-lg">
              AI-Powered Recommendations
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Generating personalized recommendations...
              </p>
            </div>
          ) : error ? (
            <div>
              <div className="mb-4 p-3 text-amber-600 border border-amber-200 rounded-md bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400 flex items-start gap-2">
                <AlertTriangleIcon className="size-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">AI Service Unavailable</p>
                  <p className="text-sm">
                    The AI recommendation service is currently unavailable. Make
                    sure you&apos;ve set up your OpenAI API key.
                  </p>
                  <p className="text-sm mt-1 text-amber-700 dark:text-amber-300">
                    Error: {error}
                  </p>
                </div>
              </div>
              {recommendations && (
                <div className="mt-4 max-w-none">{renderRecommendations()}</div>
              )}
            </div>
          ) : recommendations ? (
            <div className="max-w-none">{renderRecommendations()}</div>
          ) : likedTech && likedTech.length > 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-muted-foreground">
                Click the &quot;Generate Recommendations&quot; button to get
                AI-powered insights.
              </p>
              <button
                onClick={() => fetchRecommendations(likedTech)}
                className="mt-4 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white hover:opacity-90 transition-opacity"
              >
                Generate Recommendations
              </button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Select your favorite technologies to get AI-powered
              recommendations.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
