export const GET = async () => {
  const baseUrl = "https://biharsurveysahayak.online";
  const today = new Date().toISOString();

  const pages = [
    { path: "/", changeFreq: "daily", priority: 1 },
    { path: "/bihar-survey", changeFreq: "weekly", priority: 0.9 },
    { path: "/bihar-survey-status", changeFreq: "weekly", priority: 0.8 },
    { path: "/bihar-survey-pdf", changeFreq: "monthly", priority: 0.7 },
  ];

  // Generate XML content
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl + page.path}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${page.changeFreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
