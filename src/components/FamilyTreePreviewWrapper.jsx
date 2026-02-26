// src/components/FamilyTreePreviewWrapper.jsx
"use client";

import dynamic from "next/dynamic";

// Only load FamilyTreePreview on the client
const FamilyTreePreview = dynamic(
  () => import("./FamilyTreePreview"),
  { ssr: false } // disable server-side rendering
);

export default FamilyTreePreview;