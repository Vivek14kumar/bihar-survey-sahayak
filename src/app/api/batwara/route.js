import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  // फ्रंटएंड से टाइप और 'isFree' चेक करें
  const { type, isFree } = await req.json(); 

  const client = await clientPromise;
  const db = client.db("analyticsDB");

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  // ⚡ डायनामिक इंक्रीमेंट डेटा तैयार करें
  let updateData = {
    totalBantwara: 1 // यह हमेशा 1 बढ़ेगा (चाहे फ्री हो या पेड)
  };

  if (isFree) {
    // अगर फ्री डाउनलोड है, तो सिर्फ फ्री वाला काउंट बढ़ाएं, पैसे नहीं
    updateData.freeBantwara = 1; 
  } else {
    // अगर पेड (प्रीमियम) है, तो पेड काउंट और रेवेन्यू दोनों बढ़ाएं
    updateData.paidBantwara = 1;
    updateData.totalRevenue = 20; // ₹20 जोड़ दें
  }

  await db.collection("dailyStats").updateOne(
    { date: today },
    {
      $inc: updateData, // जो डेटा ऊपर सेट किया है, उसे इंक्रीमेंट करें
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}