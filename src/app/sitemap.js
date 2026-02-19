export default function sitemap() {
  const today = new Date();
  return [
    {
      url: "https://biharsurveysahayak.online",
      lastModified: today,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://biharsurveysahayak.online/bihar-survey",
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://biharsurveysahayak.online/pdf",
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://biharsurveysahayak.online/privacy-policy",
      lastModified: today,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://biharsurveysahayak.online/terms-and-conditions",
      lastModified: today,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://biharsurveysahayak.online/disclaimer",
      lastModified: today,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://biharsurveysahayak.online/#tool",
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
