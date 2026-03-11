import { locations } from "@/data/locations";

export default function sitemap() {

  const baseUrl = "https://biharsurveysahayak.online";

  const blogPosts = [
    "prapatra-2-kaise-bhare",
    "bihar-survey-vanshavali-kaise-banaye",
    "bihar-survey-objection-application",
    "bihar-survey-parimarjan-process",
    "bihar-survey-required-documents",
    "bihar-jamin-batwara-application",
    "jamabandi-cancellation-application",
    "bihar-survey-shapath-patra",
    "bihar-survey-status-check",
    "bihar-co-karmchari-hartal"
  ];

  const blogUrls = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8
  }));


  /* ---------------- DISTRICT PAGES ---------------- */

  const districts = [...new Set(locations.map(l => l.district))];

  const districtUrls = districts.map((district) => ({
    url: `${baseUrl}/survey/${district}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85
  }));


  /* ---------------- BLOCK PAGES ---------------- */

  const blockUrls = locations.map((loc) => ({
    url: `${baseUrl}/survey/${loc.district}/${loc.block}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8
  }));


  return [

    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0
    },

    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },

    {
      url: `${baseUrl}/bihar-survey`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },

    {
      url: `${baseUrl}/prapatra-2`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },

    {
      url: `${baseUrl}/batwara-application-bihar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },

    {
      url: `${baseUrl}/shapath-patra`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },

    {
      url: `${baseUrl}/objection-letter`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },

    {
      url: `${baseUrl}/cancellation-jamabandhi`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },

    {
      url: `${baseUrl}/forms`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85
    },

    {
      url: `${baseUrl}/pdf`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },

    {
      url: `${baseUrl}/pdf-toolkit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },

    {
      url: `${baseUrl}/parimarjan-help`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85
    },

    ...blogUrls,
    ...districtUrls,
    ...blockUrls,

    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4
    },

    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4
    },

    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4
    }

  ];
}