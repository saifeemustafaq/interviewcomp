"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Get Convex URL from environment variable (set in Netlify)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Convex features will not work.");
}

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    // Fallback if Convex is not configured
    return <>{children}</>;
  }
  
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

