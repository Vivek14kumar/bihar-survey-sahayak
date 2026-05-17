"use client";

import { useEffect } from "react";

export default function CleanUrl() {
  useEffect(() => {
    // Check if the URL has ?preview=true
    if (window.location.search.includes("preview=true")) {
      // Create the clean URL without the query parameter
      const cleanUrl = window.location.origin + window.location.pathname;
      // Replace the URL in the browser bar instantly
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  return null; // This component doesn't render anything visually
}