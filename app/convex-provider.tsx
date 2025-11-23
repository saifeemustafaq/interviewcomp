"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Get Convex URL from environment variable (set in Netlify)
  // Use useMemo to avoid recreating client on every render
  const convex = useMemo(() => {
    // On client-side, try to get from window if available (for Netlify)
    let convexUrl: string | undefined;
    
    if (typeof window !== "undefined") {
      // Try to get from window (set by Next.js)
      convexUrl = (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_CONVEX_URL;
    }
    
    // Fallback to process.env (works in both server and client)
    if (!convexUrl) {
      convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    }
    
    if (!convexUrl) {
      console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Convex features will not work.");
      // Create a dummy client to prevent hook errors
      // It won't work, but hooks won't throw
      return new ConvexReactClient("https://dummy.convex.cloud");
    }
    
    return new ConvexReactClient(convexUrl);
  }, []);

  // Always provide ConvexProvider so hooks don't error
  // Even with dummy URL, provider exists so hooks work (they'll just fail to connect)
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

