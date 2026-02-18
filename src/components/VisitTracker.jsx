"use client";

import { useEffect } from "react";

export default function VisitTracker() {
 useEffect(() => {
  const today = new Date().toDateString();

  // 1️⃣ Always increase page views
  fetch("/api/track-visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "pageViews" }),
  });

  // 2️⃣ Unique Visitor (lifetime)
  const hasVisited = localStorage.getItem("uniqueVisitor");

  if (!hasVisited) {
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "uniqueVisitors" }),
    });

    localStorage.setItem("uniqueVisitor", "true");
  }

  // 3️⃣ Today Visitor
  const lastVisit = localStorage.getItem("visitDate");

  if (lastVisit !== today) {
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "todayVisitors" }),
    });

    localStorage.setItem("visitDate", today);
  }

}, []);


  return null; // nothing visible
}
