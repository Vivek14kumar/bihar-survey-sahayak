"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }) {
  useEffect(() => {
    // 1. Check browser memory
    const hasViewed = sessionStorage.getItem(`viewed_profile_${slug}`);

    if (!hasViewed) {
      // 2. Call your API to increase the count
      const trackView = async () => {
        try {
          await fetch("/api/amins/track-view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, type: "view" }),
          });
          
          // 3. Save to browser so refresh doesn't trigger it again
          sessionStorage.setItem(`viewed_profile_${slug}`, "true");
        } catch (error) {
          console.error("Failed to track view", error);
        }
      };

      trackView();
    }
  }, [slug]);

  // Return null because this component doesn't show anything on the screen
  return null; 
}