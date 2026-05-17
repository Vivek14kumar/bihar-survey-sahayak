import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary securely using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // 1. Get the form data from the incoming request
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // 2. Convert the file into a Node.js Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Upload the buffer to Cloudinary using a stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'amin_kyc_documents' }, // It will create this folder in Cloudinary
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // End the stream and send the buffer
      uploadStream.end(buffer);
    });

    // 4. Return the secure Cloudinary URL to the frontend
    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url 
    });

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload to Cloudinary" }, { status: 500 });
  }
}