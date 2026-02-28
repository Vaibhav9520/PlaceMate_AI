import Vapi from "@vapi-ai/web";

// Get VAPI token from environment
const token = import.meta.env.VITE_VAPI_WEB_TOKEN;

// Log token status for debugging
if (typeof window !== 'undefined') {
  console.log("VAPI Token Status:", token ? "Present" : "Missing");
  if (!token) {
    console.error("VAPI_WEB_TOKEN is missing from environment variables");
    console.error("Please ensure VITE_VAPI_WEB_TOKEN is set in .env");
  }
}

// Initialize VAPI client
// Note: Token validation happens when starting a call
export const vapi = new Vapi(token || "");
