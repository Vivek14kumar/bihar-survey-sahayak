import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;

  const analyticsDB = client.db("analyticsDB");
  const pdfDB = client.db("pdfDatabase");

  const siteStatsData = await analyticsDB
    .collection("siteStats")
    .find()
    .toArray();

  const pdfData = await pdfDB
    .collection("pdfCounts")
    .find()
    .toArray();

  const formattedStats = {
    pageVisit: 0,
    vanshawaliCreated: 0,
  };

  siteStatsData.forEach((item) => {
    formattedStats[item.name] = item.count;
  });

  const totalPreview = pdfData.reduce(
    (sum, item) => sum + (item.preview || 0),
    0
  );

  const totalDownload = pdfData.reduce(
    (sum, item) => sum + (item.download || 0),
    0
  );

  return Response.json({
    ...formattedStats,
    totalPreview,
    totalDownload,
    pdfData,
  });
}
