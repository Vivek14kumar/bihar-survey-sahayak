export const revalidate = 3600; // Refreshes the sitemap every 1 hour

import { locations } from "@/app/(public)/data/locations";
import { postSlugs } from "@/app/(public)/data/postSlugs";

// 1. Import your DB fetch function
import { getLiveAminProfilesForSitemap } from "../lib/actions/aminActions";

export default async function sitemap() {

  const baseUrl = "https://biharsurveysahayak.online";

  /* ---------------- 1. FETCH DYNAMIC AMIN PROFILES (DATABASE) ---------------- */
  const liveAmins = await getLiveAminProfilesForSitemap();

  const aminUrls = liveAmins.map((amin) => ({
    url: `${baseUrl}/amin/${amin.slug}`,
    // If updatedAt exists use it, otherwise fallback to current date
    lastModified: amin.updatedAt ? new Date(amin.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

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

    /* ---------------- NEW INFORMATIVE & TOOL PAGES ---------------- */
    {
      url: `${baseUrl}/bihar-bhumi-jankari`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/register-2-online`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/land-records-khatiyan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/official-portal-guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/property-registration-details`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/bihar-bhumi-survey-online`,
      lastModified: new Date(),
      changeFrequency: "weekly",
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
      url: `${baseUrl}/prapatra-3-1`,
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
      url: `${baseUrl}/death-certificate-declaration`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },

    {
      url: `${baseUrl}/death-certificate-affidavit`,
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
      url: `${baseUrl}/district-review-updates`,
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
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },

    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },

    {
      url: `${baseUrl}/forgot-password`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85
    },

    // Spread the dynamic arrays into the final list
    ...blogUrls,
    ...districtUrls,
    ...blockUrls,
    ...aminUrls,

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