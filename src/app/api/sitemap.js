export default function sitemap() {
  return [
    {
      url: "https://biharsurveysahayak.online",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://biharsurveysahayak.online/bihar-survey",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://biharsurveysahayak.online/bihar-survey-status",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://biharsurveysahayak.online/bihar-survey-pdf",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
