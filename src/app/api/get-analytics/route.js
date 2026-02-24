import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;

  const analyticsDB = client.db("analyticsDB");
  const pdfDB = client.db("pdfDatabase");

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  /* ================= TOOL + REVENUE DATA ================= */

  const dailyData = await analyticsDB
    .collection("dailyStats")
    .find({})
    .sort({ date: -1 })
    .toArray();

  let totals = {
    vanshawaliCreated: 0,
    prapatra2Printed: 0,
    vanshawaliPaid: 0,
    prapatra2Paid: 0,
    totalRevenue: 0,
  };

  dailyData.forEach((day) => {
    totals.vanshawaliCreated += day.vanshawaliCreated || 0;
    totals.prapatra2Printed += day.prapatra2Printed || 0;
    totals.vanshawaliPaid += day.vanshawaliPaid || 0;
    totals.prapatra2Paid += day.prapatra2Paid || 0;
    totals.totalRevenue += day.totalRevenue || 0;
  });

  const todayData = dailyData.find((d) => d.date === today) || {};

  /* ================= VISITOR DATA ================= */

  const pageViewsDoc = await analyticsDB
    .collection("siteStats")
    .findOne({ name: "pageViews" });

  const uniqueVisitorsDoc = await analyticsDB
    .collection("siteStats")
    .findOne({ name: "uniqueVisitors" });

  const todayVisitDoc = await analyticsDB
    .collection("visits")
    .findOne({ date: today });

  const todayVisitors = todayVisitDoc?.visitors?.length || 0;

  /* ================= PDF ANALYTICS ================= */

  const pdfData = await pdfDB.collection("pdfCounts").find().toArray();

  const totalPreview = pdfData.reduce(
    (sum, item) => sum + (item.preview || 0),
    0
  );

  const totalDownload = pdfData.reduce(
    (sum, item) => sum + (item.download || 0),
    0
  );

  /* ================= FINAL RESPONSE ================= */

  return Response.json({
    totals,
    today: todayData,
    last7Days: dailyData.slice(0, 7),

    pageViews: pageViewsDoc?.count || 0,
    uniqueVisitors: uniqueVisitorsDoc?.count || 0,
    todayVisitors,

    totalPreview,
    totalDownload,
    pdfData,
  });
}