// app/api/mark-paid/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  const response = NextResponse.json({ success: true });

  // Set cookie that user has paid
  response.cookies.set("vanshavali_paid", "true", {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}