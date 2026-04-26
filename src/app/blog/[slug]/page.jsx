import Link from "next/link";
import CompactQuickLinks from "@/components/QuickLinksFooter";
import ShareButton from "@/components/ShareButton";
import SubscribeButton from "@/components/SubscribeButton";
import WhatsAppButton from "@/components/WhatsAppButton";

// Import your data from the new file!
import { posts } from "@/app/data/posts"; 

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

      {/* TOOL CTA */}
      <div className="mt-14 bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">
          Online Tool
        </h3>
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
      </div>

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
    </>
  );
}