// app/api/get-pdf/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const pdfDirectory = path.join(process.cwd(), "public/pdf");
    const files = fs.readdirSync(pdfDirectory);

    const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

    return NextResponse.json({ files: pdfFiles });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
