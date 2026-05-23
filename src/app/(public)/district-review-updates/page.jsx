import ViralDistrictUpdatePage from "./ViralDistrictUpdatePage";

export const metadata = {
  title:
    "मंत्री जी का जिलेवार समीक्षा कार्यक्रम 2026 | आज किन जिलों में होगी समीक्षा",

  description:
    "देखें मंत्री जी का जिलेवार समीक्षा एवं निगरानी कार्यक्रम 2026। आज किन जिलों में समीक्षा, निरीक्षण, प्रशासनिक निगरानी और विभागीय गतिविधियाँ होंगी इसकी पूरी जानकारी प्राप्त करें।",

  keywords: [
    "मंत्री जी समीक्षा कार्यक्रम",
    "जिलेवार समीक्षा",
    "बिहार राजस्व विभाग",
    "जिला समीक्षा सूची",
    "आज किन जिलों में समीक्षा होगी",
    "District Review Schedule 2026",
    "Bihar Survey Update",
    "Revenue Department Monitoring",
    "Bihar District Monitoring",
    "Bihar News Update",
  ],

  openGraph: {
    title:
      "आज किन जिलों में होगी समीक्षा? | मंत्री जी का जिलेवार कार्यक्रम",

    description:
      "मंत्री जी का लाइव जिलेवार समीक्षा एवं निगरानी कार्यक्रम देखें। जानें आज किन जिलों में प्रशासनिक समीक्षा और विभागीय गतिविधियाँ होंगी।",

    url: "https://yourdomain.com/district-review-updates",

    siteName: "Bihar Survey Sahayak",

    images: [
      {
        url: "/images/district-review-banner.jpg",
        width: 1200,
        height: 630,
        alt: "District Review Updates",
      },
    ],

    locale: "hi_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "आज किन जिलों में होगी समीक्षा? | मंत्री जी का जिलेवार कार्यक्रम",

    description:
      "जिलेवार समीक्षा एवं प्रशासनिक निगरानी कार्यक्रम की पूरी सूची देखें।",

    images: ["/images/district-review-banner.jpg"],
  },

  alternates: {
    canonical: "https://yourdomain.com/district-review-updates",
  },
};

export default function page (){
    return(
        <ViralDistrictUpdatePage/>
    );
}