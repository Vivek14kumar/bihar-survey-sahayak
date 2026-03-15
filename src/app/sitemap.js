import { locations } from "@/app/data/locations";
import { postSlugs } from "@/app/data/postSlugs";

export default function sitemap() {

  const baseUrl = "https://biharsurveysahayak.online";

    /* ---------------- BLOG PAGES ---------------- */

  const blogUrls = postSlugs.map((slug) => ({
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

  const blockUrls = locations.flatMap((loc) =>
    loc.blocks.map((block) => ({
      url: `${baseUrl}/survey/${loc.district}/${block}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    }))
  );


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