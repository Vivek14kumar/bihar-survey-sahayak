import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;

  const analyticsDB = client.db("analyticsDB");
  const pdfDB = client.db("pdfDatabase");

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  /* ================= DAILY DATA ================= */

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
    affidavitPaid: 0,
    totalRevenue: 0,
    pageViews: 0,
    uniqueVisitors: 0,
  };

  dailyData.forEach((day) => {
  totals.pageViews += day.pageViews || 0;
});

  dailyData.forEach((day) => {
    totals.vanshawaliCreated += day.vanshawaliCreated || 0;
    totals.prapatra2Printed += day.prapatra2Printed || 0;
    totals.vanshawaliPaid += day.vanshawaliPaid || 0;
    totals.prapatra2Paid += day.prapatra2Paid || 0;
    totals.affidavitPaid += day.affidavitPaid || 0;
    totals.totalRevenue += day.totalRevenue || 0;

    totals.pageViews += day.pageViews || 0;
    totals.uniqueVisitors += day.uniqueVisitors || 0;
  });

  const todayData = dailyData.find((d) => d.date === today) || {};

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

    pageViews: totals.pageViews,
    uniqueVisitors: totals.uniqueVisitors,
    todayVisitors: todayData.uniqueVisitors || 0,

    totalPreview,
    totalDownload,
    pdfData,
  });
}