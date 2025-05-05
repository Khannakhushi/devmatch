import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  SparklesIcon,
  Loader2Icon,
  AlertTriangleIcon,
  RocketIcon,
  CodeIcon,
  ServerIcon,
  DatabaseIcon,
  CloudIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface AiRecommendationsProps {
  likedTech: string[];
}

interface TechRecommendation {
  name: string;
  description: string;
  resources?: {
    name: string;
    url: string;
    type: "documentation" | "tutorial" | "course" | "community";
  }[];
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

  // Generate a fallback recommendation when the API fails
  const generateFallbackRecommendation = (): RecommendationData => {
    // Check if the user has selected specific technology domains
    const hasMobileTech = likedTech.some((tech) =>
      ["swift", "reactnative", "flutter", "kotlin"].includes(tech)
    );

    const hasWebTech = likedTech.some((tech) =>
      ["react", "nextjs", "vue", "angular", "svelte", "tailwind"].includes(tech)
    );

    const hasPythonTech = likedTech.some((tech) =>
      ["python", "django", "flask"].includes(tech)
    );

    // Detect iOS specific stack
    const hasIosTech = likedTech.includes("swift");

    // Detect Android specific stack
    const hasAndroidTech = likedTech.includes("kotlin");

    // Provide specialized recommendations based on the detected domain
    if (hasIosTech) {
      // iOS-specific recommendations
      return {
        frontend: [
          {
            name: "SwiftUI",
            description:
              "Modern UI framework for Swift that pairs perfectly with your iOS development, using a declarative syntax and powerful layout system for building beautiful interfaces.",
            resources: [
              {
                name: "Apple SwiftUI Documentation",
                url: "https://developer.apple.com/documentation/swiftui/",
                type: "documentation",
              },
              {
                name: "SwiftUI by Example (Free)",
                url: "https://www.hackingwithswift.com/quick-start/swiftui",
                type: "tutorial",
              },
              {
                name: "Stanford CS193p (Free iOS Course)",
                url: "https://cs193p.sites.stanford.edu/",
                type: "course",
              },
            ],
          },
          {
            name: "Combine",
            description:
              "Reactive programming framework by Apple that integrates perfectly with Swift and SwiftUI for handling asynchronous events and data streams in your iOS applications.",
            resources: [
              {
                name: "Apple Combine Documentation",
                url: "https://developer.apple.com/documentation/combine",
                type: "documentation",
              },
              {
                name: "Getting Started with Combine",
                url: "https://www.raywenderlich.com/7864801-combine-getting-started",
                type: "tutorial",
              },
              {
                name: "Combine: Asynchronous Programming with Swift (Book)",
                url: "https://www.raywenderlich.com/books/combine-asynchronous-programming-with-swift",
                type: "tutorial",
              },
            ],
          },
        ],
        backend: [
          {
            name: "CloudKit",
            description:
              "Apple's native cloud storage solution designed specifically for iOS apps, offering seamless integration with Swift and the ability to sync data across devices.",
            resources: [
              {
                name: "Apple CloudKit Documentation",
                url: "https://developer.apple.com/documentation/cloudkit/",
                type: "documentation",
              },
              {
                name: "CloudKit Quick Start Guide",
                url: "https://developer.apple.com/library/archive/documentation/DataManagement/Conceptual/CloudKitQuickStart/Introduction/Introduction.html",
                type: "tutorial",
              },
              {
                name: "CloudKit Tutorial (Hacking with Swift)",
                url: "https://www.hackingwithswift.com/read/33/overview",
                type: "tutorial",
              },
            ],
          },
          {
            name: "Firebase",
            description:
              "Mobile development platform with excellent Swift support for auth, databases, and cloud functions, widely used by professional iOS developers.",
            resources: [
              {
                name: "Firebase iOS Documentation",
                url: "https://firebase.google.com/docs/ios/setup",
                type: "documentation",
              },
              {
                name: "Firebase iOS Codelab",
                url: "https://firebase.google.com/codelabs/firebase-ios",
                type: "tutorial",
              },
              {
                name: "Swift & Firebase: Build a iOS Chat App",
                url: "https://www.youtube.com/watch?v=iHpXyMIkVX0",
                type: "course",
              },
            ],
          },
        ],
        database: [
          {
            name: "Core Data",
            description:
              "Apple's native persistence framework optimized for iOS that works perfectly with Swift, providing a fast, reliable database solution with object-graph management.",
            resources: [
              {
                name: "Apple Core Data Documentation",
                url: "https://developer.apple.com/documentation/coredata",
                type: "documentation",
              },
              {
                name: "Core Data by Tutorials (Hacking with Swift)",
                url: "https://www.hackingwithswift.com/store/core-data",
                type: "tutorial",
              },
              {
                name: "Core Data & SwiftUI Tutorial",
                url: "https://www.youtube.com/watch?v=O1U0zId_d2I",
                type: "tutorial",
              },
            ],
          },
          {
            name: "Realm",
            description:
              "Mobile-first database solution with excellent Swift support, designed to be faster and more intuitive than Core Data while offering cross-platform compatibility.",
            resources: [
              {
                name: "Realm Swift Documentation",
                url: "https://www.mongodb.com/docs/realm/sdk/swift/",
                type: "documentation",
              },
              {
                name: "Realm Swift SDK Tutorial",
                url: "https://www.mongodb.com/docs/realm/sdk/swift/get-started/",
                type: "tutorial",
              },
              {
                name: "Realm Crash Course (YouTube)",
                url: "https://www.youtube.com/watch?v=hC6dLLbFUJc",
                type: "tutorial",
              },
            ],
          },
        ],
        cloud: [
          {
            name: "App Store Connect",
            description:
              "Essential platform for iOS developers to distribute and manage apps in the App Store, with tools for analytics, TestFlight beta testing, and app review.",
            resources: [
              {
                name: "App Store Connect Documentation",
                url: "https://developer.apple.com/app-store-connect/",
                type: "documentation",
              },
              {
                name: "Submitting Your App to the App Store",
                url: "https://developer.apple.com/documentation/xcode/submitting-your-app-for-review",
                type: "tutorial",
              },
              {
                name: "TestFlight Beta Testing Guide",
                url: "https://testflight.apple.com/",
                type: "documentation",
              },
            ],
          },
          {
            name: "AWS Amplify",
            description:
              "Full-stack development platform with dedicated iOS SDKs that simplifies building cloud-powered Swift applications with authentication, storage, and API management.",
            resources: [
              {
                name: "AWS Amplify iOS Documentation",
                url: "https://docs.amplify.aws/start/q/integration/ios/",
                type: "documentation",
              },
              {
                name: "Getting Started with Amplify iOS",
                url: "https://docs.amplify.aws/lib/q/platform/ios/",
                type: "tutorial",
              },
              {
                name: "Building iOS Applications with AWS Amplify",
                url: "https://aws.amazon.com/getting-started/hands-on/build-ios-app-amplify/",
                type: "tutorial",
              },
            ],
          },
        ],
        projectIdeas: [
          {
            name: "Health & Fitness Tracker",
            description:
              "Create an iOS app using Swift, SwiftUI, and HealthKit that helps users track workouts, nutrition, and health metrics with beautiful visualizations and insights.",
          },
          {
            name: "AR Shopping Experience",
            description:
              "Build an immersive iOS shopping app with Swift, ARKit, and Core ML that lets users visualize products in their space before purchasing, with CloudKit backend for data syncing.",
          },
        ],
      };
    } else if (hasAndroidTech) {
      // Android-specific recommendations
      return {
        frontend: [
          {
            name: "Jetpack Compose",
            description:
              "Modern UI toolkit for Android that pairs perfectly with Kotlin, using a declarative approach similar to SwiftUI for building beautiful, responsive interfaces.",
          },
          {
            name: "Material Design Components",
            description:
              "Official design system for Android that works seamlessly with Kotlin and Jetpack Compose, providing ready-to-use UI components that follow Google's design guidelines.",
          },
        ],
        backend: [
          {
            name: "Firebase",
            description:
              "Google's mobile platform with first-class Kotlin support, providing authentication, real-time database, cloud functions and more for Android developers.",
          },
          {
            name: "Ktor",
            description:
              "Kotlin-first web framework by JetBrains that allows you to build connected applications with the same language you use for Android development.",
          },
        ],
        database: [
          {
            name: "Room",
            description:
              "Android's recommended database solution that provides an abstraction layer over SQLite, with excellent Kotlin support and coroutines integration.",
          },
          {
            name: "Realm",
            description:
              "Mobile-first database solution with great Kotlin support, offering better performance than SQLite while maintaining an intuitive, object-oriented API.",
          },
        ],
        cloud: [
          {
            name: "Google Play Console",
            description:
              "Essential platform for Android developers to publish and manage apps, with tools for automated testing, analytics, and distribution.",
          },
          {
            name: "Google Cloud Platform",
            description:
              "Comprehensive cloud services with dedicated Android SDKs and Kotlin support, offering machine learning, storage, and serverless functions optimized for mobile.",
          },
        ],
        projectIdeas: [
          {
            name: "Smart Home Controller",
            description:
              "Build an Android app with Kotlin and Jetpack Compose that integrates with smart home APIs to control devices, set up routines, and monitor energy usage with elegant UI.",
          },
          {
            name: "Travel Companion",
            description:
              "Create a full-featured travel app with Kotlin, Material Design, and Maps API that helps users plan trips, discover local attractions, and share experiences offline-first with Room database.",
          },
        ],
      };
    } else if (hasMobileTech) {
      // General mobile recommendations
      return {
        frontend: [
          {
            name: "Expo",
            description:
              "Development platform for React Native that simplifies cross-platform mobile development with pre-built components and easy deployment for both iOS and Android.",
          },
          {
            name: "MobX",
            description:
              "Simple, scalable state management library that works perfectly with React Native for creating predictable mobile app state flows.",
          },
        ],
        backend: [
          {
            name: "Firebase",
            description:
              "Comprehensive backend platform designed for mobile developers with authentication, databases, storage, and cloud functions that work across iOS and Android.",
          },
          {
            name: "Supabase",
            description:
              "Open-source Firebase alternative with modern APIs for mobile developers, offering real-time databases, authentication, and storage with excellent SDKs.",
          },
        ],
        database: [
          {
            name: "Watermelon DB",
            description:
              "High-performance reactive database for React Native that's optimized for offline-first mobile applications with excellent synchronization capabilities.",
          },
          {
            name: "Realm",
            description:
              "Cross-platform mobile database that offers seamless synchronization, offline support, and high performance for modern mobile apps.",
          },
        ],
        cloud: [
          {
            name: "App Center",
            description:
              "Microsoft's mobile-focused DevOps service offering continuous integration, testing, distribution, and monitoring for both iOS and Android applications.",
          },
          {
            name: "Vercel",
            description:
              "Deployment platform with excellent support for serving backend APIs to mobile apps, providing global CDN distribution and serverless functions.",
          },
        ],
        projectIdeas: [
          {
            name: "Cross-Platform Social Media App",
            description:
              "Build a mobile social network with React Native or Flutter that focuses on shared interests, with real-time chat, media sharing, and offline support.",
          },
          {
            name: "Mobile E-commerce Experience",
            description:
              "Create a stunning mobile shopping app with animations, AR product visualization, secure payment processing, and synchronized shopping cart across devices.",
          },
        ],
      };
    } else if (hasPythonTech) {
      // Python specific stack
      return {
        frontend: [
          {
            name: "Streamlit",
            description:
              "Python-native framework for rapidly building data apps with minimal frontend code, perfect for data scientists and Python developers creating interactive visualizations.",
          },
          {
            name: "Dash",
            description:
              "Python framework for building analytical web applications using Plotly, ideal for creating interactive dashboards without extensive frontend knowledge.",
          },
        ],
        backend: [
          {
            name: "FastAPI",
            description:
              "Modern, high-performance Python web framework with automatic OpenAPI documentation, perfect for building APIs that complement Django or Flask applications.",
          },
          {
            name: "Celery",
            description:
              "Distributed task queue system for Python that works perfectly with Django and Flask, enabling background processing and scheduled tasks in web applications.",
          },
        ],
        database: [
          {
            name: "PostgreSQL",
            description:
              "Powerful open-source database with excellent Python drivers and Django integration, offering advanced features like JSON storage and full-text search.",
          },
          {
            name: "SQLAlchemy",
            description:
              "SQL toolkit and ORM for Python that integrates well with Flask and provides a more flexible alternative to Django's ORM with support for complex queries.",
          },
        ],
        cloud: [
          {
            name: "Heroku",
            description:
              "Cloud platform with first-class Python support and seamless deployment for Django and Flask applications, offering add-ons for databases and monitoring.",
          },
          {
            name: "AWS Lambda",
            description:
              "Serverless compute service with Python runtime that works well for deploying Python API endpoints and background tasks without managing servers.",
          },
        ],
        projectIdeas: [
          {
            name: "Data Analytics Dashboard",
            description:
              "Build a Python web application with Django/Flask and Plotly/D3.js that visualizes complex datasets with interactive charts, filters, and export options.",
          },
          {
            name: "AI-Powered Content Manager",
            description:
              "Create a content management system with Python that uses machine learning for automatic tagging, content recommendations, and intelligent search functionality.",
          },
        ],
      };
    } else if (hasWebTech) {
      // Web development stack
      return {
        frontend: [
          {
            name: "Framer Motion",
            description:
              "Production-ready animation library for React that seamlessly integrates with your components for creating fluid, interactive UI animations and gestures.",
          },
          {
            name: "TanStack Query",
            description:
              "Data-fetching library for React that simplifies server state management with automatic caching, background updates, and optimistic UI updates.",
          },
        ],
        backend: [
          {
            name: "Node.js",
            description:
              "JavaScript runtime used by LinkedIn, Netflix and Uber that lets you use the same language on client and server with a massive ecosystem.",
            resources: [
              {
                name: "Node.js Documentation",
                url: "https://nodejs.org/en/docs/",
                type: "documentation",
              },
              {
                name: "Node.js Tutorial (W3Schools)",
                url: "https://www.w3schools.com/nodejs/",
                type: "tutorial",
              },
              {
                name: "Node.js Crash Course (Traversy Media)",
                url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
                type: "tutorial",
              },
            ],
          },
          {
            name: "tRPC",
            description:
              "End-to-end typesafe API framework that pairs perfectly with React and TypeScript, enabling seamless communication between frontend and backend.",
          },
        ],
        database: [
          {
            name: "MongoDB",
            description:
              "Document database that works excellently with Node.js and JavaScript, offering flexible schema design and intuitive data models for web applications.",
            resources: [
              {
                name: "MongoDB Documentation",
                url: "https://docs.mongodb.com/",
                type: "documentation",
              },
              {
                name: "MongoDB University (Free Courses)",
                url: "https://university.mongodb.com/",
                type: "course",
              },
              {
                name: "MongoDB Crash Course (Traversy Media)",
                url: "https://www.youtube.com/watch?v=-56x56UppqQ",
                type: "tutorial",
              },
            ],
          },
          {
            name: "Prisma",
            description:
              "Next-generation ORM for Node.js and TypeScript that simplifies database access with auto-generated types and a intuitive query API.",
          },
        ],
        cloud: [
          {
            name: "Vercel",
            description:
              "Developer-friendly platform optimized for React, Next.js and other modern web frameworks, offering global CDN, edge functions and seamless GitHub integration.",
            resources: [
              {
                name: "Vercel Documentation",
                url: "https://vercel.com/docs",
                type: "documentation",
              },
              {
                name: "Deploying Next.js to Vercel (Tutorial)",
                url: "https://nextjs.org/learn/basics/deploying-nextjs-app",
                type: "tutorial",
              },
              {
                name: "Vercel Getting Started",
                url: "https://vercel.com/guides/getting-started-with-vercel",
                type: "tutorial",
              },
            ],
          },
          {
            name: "Netlify",
            description:
              "Complete platform for modern web projects with continuous deployment, serverless functions, and edge computing that works with any frontend framework.",
          },
        ],
        projectIdeas: [
          {
            name: "Interactive Course Platform",
            description:
              "Build a modern web application with React/Next.js that offers interactive coding lessons, progress tracking, and community features with real-time collaboration.",
          },
          {
            name: "AI-Enhanced Productivity Tool",
            description:
              "Create a web app that uses AI for task management, meeting summaries, and smart scheduling, with offline support and real-time synchronization between devices.",
          },
        ],
      };
    }

    // Default fallback for other or mixed technology stacks
    return {
      frontend: [
        {
          name: "React",
          description:
            "Industry-standard UI library used by Facebook, Instagram and Airbnb with extensive documentation and the largest job market demand.",
          resources: [
            {
              name: "Official React Documentation",
              url: "https://react.dev/",
              type: "documentation",
            },
            {
              name: "React - The Complete Guide (Udemy)",
              url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
              type: "course",
            },
            {
              name: "Full React Tutorial (Net Ninja)",
              url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d",
              type: "tutorial",
            },
            {
              name: "React Reddit Community",
              url: "https://www.reddit.com/r/reactjs/",
              type: "community",
            },
          ],
        },
        {
          name: "Tailwind CSS",
          description:
            "Modern utility-first CSS framework used by Netflix and Shopify that makes styling intuitive while maintaining a professional look.",
          resources: [
            {
              name: "Tailwind CSS Documentation",
              url: "https://tailwindcss.com/docs",
              type: "documentation",
            },
            {
              name: "Tailwind CSS From Scratch (YouTube)",
              url: "https://www.youtube.com/watch?v=dFgzHOX84xQ",
              type: "tutorial",
            },
            {
              name: "Tailwind CSS Examples",
              url: "https://tailwindcss.com/examples",
              type: "tutorial",
            },
          ],
        },
      ],
      backend: [
        {
          name: "Node.js",
          description:
            "JavaScript runtime used by LinkedIn, Netflix and Uber that lets you use the same language on client and server with a massive ecosystem.",
          resources: [
            {
              name: "Node.js Documentation",
              url: "https://nodejs.org/en/docs/",
              type: "documentation",
            },
            {
              name: "Node.js Tutorial (W3Schools)",
              url: "https://www.w3schools.com/nodejs/",
              type: "tutorial",
            },
            {
              name: "Node.js Crash Course (Traversy Media)",
              url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
              type: "tutorial",
            },
          ],
        },
        {
          name: "Express",
          description:
            "Lightweight, beginner-friendly Node.js framework with excellent documentation and widespread industry adoption for building APIs.",
          resources: [
            {
              name: "Express Documentation",
              url: "https://expressjs.com/",
              type: "documentation",
            },
            {
              name: "Express.js Crash Course (Traversy Media)",
              url: "https://www.youtube.com/watch?v=L72fhGm1tfE",
              type: "tutorial",
            },
            {
              name: "MDN Express Tutorial",
              url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs",
              type: "tutorial",
            },
          ],
        },
      ],
      database: [
        {
          name: "MongoDB",
          description:
            "Modern NoSQL database used by Uber, eBay and Electronic Arts with excellent documentation and easy setup for JavaScript developers.",
          resources: [
            {
              name: "MongoDB Documentation",
              url: "https://docs.mongodb.com/",
              type: "documentation",
            },
            {
              name: "MongoDB University (Free Courses)",
              url: "https://university.mongodb.com/",
              type: "course",
            },
            {
              name: "MongoDB Crash Course (Traversy Media)",
              url: "https://www.youtube.com/watch?v=-56x56UppqQ",
              type: "tutorial",
            },
          ],
        },
        {
          name: "PostgreSQL",
          description:
            "Powerful open-source SQL database used by Instagram and Spotify that balances ease of use with advanced features like JSON storage.",
          resources: [
            {
              name: "PostgreSQL Documentation",
              url: "https://www.postgresql.org/docs/",
              type: "documentation",
            },
            {
              name: "PostgreSQL Tutorial",
              url: "https://www.postgresqltutorial.com/",
              type: "tutorial",
            },
            {
              name: "PostgreSQL Full Course for Beginners",
              url: "https://www.youtube.com/watch?v=qw--VYLpxG4",
              type: "course",
            },
          ],
        },
      ],
      cloud: [
        {
          name: "Vercel",
          description:
            "Developer-friendly platform used by Airbnb and TikTok that makes deploying modern websites simple with zero configuration.",
          resources: [
            {
              name: "Vercel Documentation",
              url: "https://vercel.com/docs",
              type: "documentation",
            },
            {
              name: "Deploying Next.js to Vercel (Tutorial)",
              url: "https://nextjs.org/learn/basics/deploying-nextjs-app",
              type: "tutorial",
            },
            {
              name: "Vercel Getting Started",
              url: "https://vercel.com/guides/getting-started-with-vercel",
              type: "tutorial",
            },
          ],
        },
        {
          name: "GitLab",
          description:
            "Complete DevOps platform that enables organizations to deliver software faster and more efficiently, with built-in CI/CD, repositories, and project management.",
          resources: [
            {
              name: "GitLab Documentation",
              url: "https://docs.gitlab.com/",
              type: "documentation",
            },
            {
              name: "GitLab CI/CD Reference",
              url: "https://docs.gitlab.com/ee/ci/",
              type: "documentation",
            },
            {
              name: "GitLab Learning Resources",
              url: "https://docs.gitlab.com/ee/tutorials/",
              type: "tutorial",
            },
            {
              name: "GitLab Community Forum",
              url: "https://forum.gitlab.com/",
              type: "community",
            },
          ],
        },
        {
          name: "Firebase",
          description:
            "Google's complete platform with authentication, databases and hosting that lets beginners build full-featured apps with minimal setup.",
          resources: [
            {
              name: "Firebase Documentation",
              url: "https://firebase.google.com/docs",
              type: "documentation",
            },
            {
              name: "Firebase Full Course (Net Ninja)",
              url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jERUGvbudErNCeSZHWUVlb",
              type: "course",
            },
            {
              name: "Firebase Crash Course (Traversy Media)",
              url: "https://www.youtube.com/watch?v=jCY6DH8F4oc",
              type: "tutorial",
            },
          ],
        },
      ],
      projectIdeas: [
        {
          name: "Social Media Dashboard",
          description:
            "Build a responsive dashboard that integrates with popular social media APIs to display statistics and schedule posts with a modern UI.",
        },
        {
          name: "E-commerce Platform",
          description:
            "Create a full-featured online store with product catalog, shopping cart, payment processing, and user accounts using modern web tools.",
        },
      ],
    };
  };

  // Function to fetch recommendations
  const fetchRecommendations = useCallback(
    async (techList: string[]) => {
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
          throw new Error(
            errorData.error || "Failed to get AI recommendations"
          );
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
    },
    [likedTech]
  );

  // Auto-fetch recommendations when likedTech changes
  useEffect(() => {
    console.log("likedTech changed:", likedTech);
    if (likedTech && likedTech.length > 0) {
      fetchRecommendations(likedTech);
    }
  }, [likedTech, fetchRecommendations]);

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

    // Define category structure with more concise titles
    const categories = [
      {
        title: "Frontend Technologies",
        subtitle: "Tools & frameworks to enhance your UI",
        items: recommendations.frontend,
        gradient: "from-blue-500 to-indigo-600",
        bgLight: "bg-blue-50",
        bgDark: "dark:bg-blue-950/30",
        borderLight: "border-blue-100",
        borderDark: "dark:border-blue-900/30",
        icon: <CodeIcon className="size-4" />,
      },
      {
        title: "Backend Technologies",
        subtitle: "Server-side tools that complement your choices",
        items: recommendations.backend,
        gradient: "from-green-500 to-emerald-600",
        bgLight: "bg-green-50",
        bgDark: "dark:bg-green-950/30",
        borderLight: "border-green-100",
        borderDark: "dark:border-green-900/30",
        icon: <ServerIcon className="size-4" />,
      },
      {
        title: "Database Options",
        subtitle: "Data storage solutions for your stack",
        items: recommendations.database,
        gradient: "from-amber-500 to-orange-600",
        bgLight: "bg-amber-50",
        bgDark: "dark:bg-amber-950/30",
        borderLight: "border-amber-100",
        borderDark: "dark:border-amber-900/30",
        icon: <DatabaseIcon className="size-4" />,
      },
      {
        title: "Cloud & Deployment",
        subtitle: "Where to deploy your application",
        items: recommendations.cloud,
        gradient: "from-sky-500 to-cyan-600",
        bgLight: "bg-sky-50",
        bgDark: "dark:bg-sky-950/30",
        borderLight: "border-sky-100",
        borderDark: "dark:border-sky-900/30",
        icon: <CloudIcon className="size-4" />,
      },
    ];

    // Only show categories with items
    const filteredCategories = categories.filter(
      (category) => category.items && category.items.length > 0
    );

    return (
      <div className="space-y-8">
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 shadow-sm backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
              <SparklesIcon className="size-4 text-white" />
            </div>
            <h3 className="text-base font-medium">Your Tech Stack Blueprint</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your selections, here are the key technologies to focus on
            for a complete, professional stack.
          </p>
        </motion.div>

        <AnimatePresence>
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 + 0.2 }}
            >
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`size-8 flex items-center justify-center rounded-full bg-gradient-to-br ${category.gradient} shadow-sm`}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-medium">{category.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {category.items.map((item, index) => (
                    <motion.div
                      key={`${category.title}-${index}`}
                      className={`p-4 rounded-xl border ${category.borderLight} ${category.borderDark} ${category.bgLight} ${category.bgDark} backdrop-blur-sm transition-all`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.05 + categoryIndex * 0.1,
                      }}
                      whileHover={{
                        y: -2,
                        boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <h4 className="font-semibold text-base">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>

                      {/* Learning resources */}
                      {item.resources && item.resources.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Learning Resources:
                          </p>
                          <div className="space-y-1">
                            {item.resources.map((resource, i) => (
                              <a
                                key={i}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                              >
                                <span className="inline-flex items-center">
                                  {resource.type === "documentation" && "📄 "}
                                  {resource.type === "tutorial" && "📚 "}
                                  {resource.type === "course" && "🎓 "}
                                  {resource.type === "community" && "👥 "}
                                  {resource.name}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {recommendations.projectIdeas &&
            recommendations.projectIdeas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 pt-4 border-t border-border/40"
              >
                <div className="mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-sm">
                      <RocketIcon className="size-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">
                        Build These Projects
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Perfect for learning your tech stack
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {recommendations.projectIdeas.map((project, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-xl border bg-purple-50 border-purple-100 dark:bg-purple-950/30 dark:border-purple-900/30 backdrop-blur-sm transition-all"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: index * 0.1 }}
                        whileHover={{
                          y: -2,
                          boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <h4 className="font-semibold text-base">
                          {project.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
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
      <Card className="border-none bg-background/40 backdrop-blur-md shadow-lg dark:bg-zinc-900/40">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-20 animate-pulse"></div>
              <div className="relative size-16 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-md">
                <Loader2Icon className="size-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            </div>
            <h3 className="mt-5 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Analyzing Your Stack
            </h3>
            <p className="mt-2 text-muted-foreground max-w-xs">
              Generating personalized recommendations based on your
              selections...
            </p>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400 mt-0.5">
                  <AlertTriangleIcon className="size-5" />
                </div>
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-400">
                    AI Service Unavailable
                  </p>
                  <p className="text-sm mt-1 text-amber-700 dark:text-amber-300">
                    The AI recommendation service is currently unavailable. Make
                    sure you&apos;ve set up your OpenAI API key.
                  </p>
                  <p className="text-xs mt-3 text-amber-600 dark:text-amber-500 font-mono bg-amber-100/50 dark:bg-amber-900/50 p-2 rounded">
                    Error: {error}
                  </p>
                </div>
              </div>
            </div>
            {recommendations && (
              <div className="mt-6">{renderRecommendations()}</div>
            )}
          </div>
        ) : recommendations ? (
          <CardContent className="p-6">{renderRecommendations()}</CardContent>
        ) : likedTech && likedTech.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-20"></div>
              <div className="relative size-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <SparklesIcon className="size-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              AI Recommendations Ready
            </h3>
            <p className="text-muted-foreground max-w-md mb-8">
              Let our AI analyze your technology choices and suggest
              complementary tools and project ideas that work well with your
              selections.
            </p>
            <Button
              onClick={() => fetchRecommendations(likedTech)}
              className="px-8 py-6 h-auto text-base rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md border-none"
            >
              <SparklesIcon className="mr-2 size-5" /> Generate AI
              Recommendations
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="size-20 flex items-center justify-center rounded-full bg-muted/50 border border-border/50 mb-6">
              <SparklesIcon className="size-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No Technologies Selected
            </h3>
            <p className="text-muted-foreground max-w-md">
              Select your favorite technologies by swiping to get AI-powered
              recommendations tailored to your preferences.
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
