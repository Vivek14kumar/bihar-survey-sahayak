import Link from "next/link";
import CompactQuickLinks from "@/components/QuickLinksFooter";
import ShareButton from "@/components/ShareButton";
import SubscribeButton from "@/components/SubscribeButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import AdSense from "@/components/AdSense";

// Import your data from the new file!
import { posts } from "@/app/(public)/data/posts"; 
// Remove the static metadata block and add this:
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return { title: "Post Not Found | Bihar Survey Sahayak" };
  }

  return {
    title: `${post.title} | Bihar Survey Sahayak`,
    description: post.intro.substring(0, 155), // Google prefers ~155 characters for meta descriptions
    openGraph: {
      title: post.title,
      description: post.intro,
      url: `https://biharsurveysahayak.online/blog/${slug}`,
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  // This tells Next.js to pre-build every slug found in your posts.js file
  return Object.keys(posts).map((slug) => ({
    slug: slug,
  }));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  
  // Read the post from the imported object
  const post = posts[slug];

  if (!post) {
    return <div className="p-10 text-center">Article not found</div>;
  }

  // 1. Create the Schema object
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.intro,
    author: {
      '@type': 'Organization',
      name: 'Bihar Survey Sahayak',
    },
    url: `https://biharsurveysahayak.online/blog/${slug}`,
  };

  return (
    <>
    {/* 2. Inject the Schema into the DOM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
    <div className="max-w-4xl mx-auto px-4 py-14">

      <h1 className="text-4xl font-bold mb-6 text-slate-800">
        {post.title}
      </h1>

      <p className="text-lg text-slate-600 mb-10 leading-relaxed">
        {post.intro}
      </p>

      {post.sections.map((section, i) => {
        // Render the icon dynamically from the data file
        const Icon = section.icon;

        return (
          <div key={i} className="mb-10">

            <div className="flex items-center gap-3 mb-4">
              <Icon className="text-blue-600" size={24} />
              <h2 className="text-2xl font-semibold">
                {section.heading}
              </h2>
            </div>

            {section.content && (
              <p className="text-slate-600 mb-4">
                {section.content}
              </p>
            )}

            {section.list && (
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                {section.list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}

            {section.steps && (
              <ol className="list-decimal pl-6 space-y-2 text-slate-600">
                {section.steps.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            )}

          </div>
        );
      })}

      {/* 👉 यहाँ पर Conditional Rendering लगायें 👈 */}
        {slug === "minister-daily-monitoring-revenue-department" && (
  <div className="my-10">

    <Link
      href="/district-review-updates"
      className="group relative flex items-center justify-between overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-orange-50 p-5 shadow-[0_10px_35px_rgba(255,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(255,0,0,0.18)]"
    >

      {/* Glow */}
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-red-500/10 blur-3xl" />

      {/* Left Content */}
      <div className="relative flex items-center gap-4">

        
        <div>

        

          <h3 className="text-lg font-black leading-tight text-gray-900 md:text-xl">
            आज किन जिलों में होगी जिलेवार समीक्षा कलेंडर देखे ?
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            मंत्री जी का जिलेवार समीक्षा एवं निगरानी कार्यक्रम देखें
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="relative hidden items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg transition-all duration-300 group-hover:scale-105 md:flex">
        View Schedule
        
      </div>

    </Link>
  </div>
)}

      {/* TOOL CTA */}
        {(post.tool || (post.tools && post.tools.length > 0)) && (
          <div className="mt-14 bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">
              {/* अगर 1 से ज्यादा टूल हैं तो 'Online Tools' दिखाएगा, वरना 'Online Tool' */}
              {post.tools && post.tools.length > 1 ? "Online Tools" : "Online Tool"}
            </h3>
            
            {/* बटन्स को एक सीध (Row) में रखने के लिए flex और gap का इस्तेमाल */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              
              {/* 1. अगर पोस्ट में 'tools' (Array) है, तो map() चलाएं */}
              {post.tools && post.tools.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="
                    block w-full sm:w-auto text-center
                    bg-blue-600 text-white 
                    px-5 py-3 sm:px-6
                    rounded-xl font-semibold
                    text-sm sm:text-base
                    hover:bg-blue-700
                    transition
                  "
                >
                  {item.text}
                </Link>
              ))}
        
              {/* 2. अगर पोस्ट में पुराना वाला 'tool' (Single Object) है, तो सिर्फ एक बटन दिखाएं */}
              {!post.tools && post.tool && (
                <Link
                  href={post.tool.link}
                  className="
                    block w-full sm:w-auto text-center
                    bg-blue-600 text-white 
                    px-5 py-3 sm:px-6
                    rounded-xl font-semibold
                    text-sm sm:text-base
                    hover:bg-blue-700
                    transition
                  "
                >
                  {post.tool.text}
                </Link>
              )}
        
            </div>
          </div>
        )}

      {/* OTHER TOOLS */}
      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-semibold mb-5">
          अन्य उपयोगी टूल
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/batwara-application-bihar" className="bg-gray-100 px-4 py-2 rounded-lg">
            बंटवारा आवेदन
          </Link>
          <Link href="/shapath-patra" className="bg-gray-100 px-4 py-2 rounded-lg">
            शपथ पत्र
          </Link>
          <Link href="/pdf-toolkit" className="bg-gray-100 px-4 py-2 rounded-lg">
            PDF Toolkit
          </Link>
        </div>

        {/* ================= NEW NOTIFICATION BOX ================= */}
        <div className="mt-10 bg-indigo-50 border border-indigo-200 p-6 rounded-xl text-center shadow-sm">
          <p className="font-semibold text-lg text-indigo-800 mb-2">
            🔔 सर्वे की कोई भी खबर न छूटने दें!
          </p>
          <p className="text-slate-600 mb-5 text-sm">
            नया फॉर्म आते ही या नया नियम बनते ही सीधा अपने फोन पर नोटिफिकेशन पाएं।
          </p>
          <div className="flex justify-center">
            <SubscribeButton />
          </div>
        </div>
        
        <div className="mt-10 mb-6 bg-green-50 border border-green-200 p-6 rounded-xl text-center shadow-sm">
          <p className="font-semibold text-lg text-green-800">
            📢 यह जानकारी दूसरों तक भी पहुंचाएं
          </p>
          <p className="text-slate-600 mt-2">
            अगर आपके गांव में भूमि सर्वे चल रहा है तो इस जानकारी को अपने WhatsApp ग्रुप में जरूर शेयर करें।
          </p>
          <div className="mt-4 flex justify-center">
            <ShareButton />
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <CompactQuickLinks/>
      </div>
      <WhatsAppButton/>
    </div>
    <AdSense adSlot="8984133218" />
    </>
  );
}