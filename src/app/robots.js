export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard","/api/"],
    },
    sitemap: "https://biharsurveysahayak.online/sitemap.xml",
  };
}
