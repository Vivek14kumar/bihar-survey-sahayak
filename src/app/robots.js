export default function robots() {
  return {
    rules: [
      {
        // General rules for all standard search engines (Google, Bing, etc.)
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api/"],
      },
      {
        // Specific rule to block Google's image crawler
        userAgent: "Googlebot-Image",
        disallow: ["/images/bg-survey1.png","/images/bg-survey1-mobile.png","/images/bg-amin.png","/images/bg-amin-mobile.png"],
      },
    ],
    sitemap: "https://biharsurveysahayak.online/sitemap.xml",
  };
}