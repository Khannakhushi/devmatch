// API Keys configuration
export const config = {
  gemini: {
    apiKey: process.env.GOOGLE_API_KEY || "",
  },
};

// Throw an error if the API key is not set
if (!config.gemini.apiKey) {
  console.warn("GOOGLE_API_KEY is not set in environment variables.");
}
