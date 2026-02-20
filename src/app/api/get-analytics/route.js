import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;

  const analyticsDB = client.db("analyticsDB");
  const pdfDB = client.db("pdfDatabase");

  const siteStatsData = await analyticsDB.collection("siteStats").find().toArray();
  const pdfData = await pdfDB.collection("pdfCounts").find().toArray();

  const formattedStats = {
    pageViews: 0,
    uniqueVisitors: 0,
    todayVisitors: 0,
    vanshawaliCreated: 0,
    prapatra2Printed: 0, // ✅ initialize
  };

  // Map count and other fields
  siteStatsData.forEach((item) => {
    if (item.name) {
      formattedStats[item.name] = item.count || 0;
    }
    // Include additional fields like prapatra2Printed
    if (item.prapatra2Printed !== undefined) {
      formattedStats.prapatra2Printed = item.prapatra2Printed;
    }
  });

  const totalPreview = pdfData.reduce((sum, item) => sum + (item.preview || 0), 0);
  const totalDownload = pdfData.reduce((sum, item) => sum + (item.download || 0), 0);

  return Response.json({
    ...formattedStats,
    totalPreview,
    totalDownload,
    pdfData,
  });
}