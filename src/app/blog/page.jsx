import Link from "next/link";
import CompactQuickLinks from "@/components/QuickLinksFooter";
import ShareButton from "@/components/ShareButton";
import { Flame, BookOpen, FileText } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

// ✅ IMPORT YOUR BLOG DATA HERE
import { posts } from "@/app/data/posts"; 

export const metadata = {
  title: "बिहार सर्वे जानकारी | Bihar Survey Guide",
  description: "बिहार भूमि सर्वे से जुड़ी सभी जानकारी – प्रपत्र-2, प्रपत्र-3, वंशावली, आपत्ति आवेदन, परिमार्जन और जरूरी दस्तावेज।"
};

const hotTopics = [
  "बिहार सर्वे प्रपत्र-2 कैसे भरें",
  "बिहार सर्वे वंशावली कैसे बनाएं",
  "बिहार सर्वे आपत्ति आवेदन",
  "बिहार सर्वे परिमार्जन प्रक्रिया",
  "बिहार सर्वे में कौन-कौन से दस्तावेज चाहिए",
  "बिहार जमीन बंटवारा आवेदन",
  "जमाबंदी रद्द करने का आवेदन",
  "बिहार सर्वे शपथ पत्र",
  "बिहार सर्वे 2027 अपडेट",
  "प्रपत्र-2 नहीं भरा तो क्या होगा",
  "बिहार सर्वे में नाम सुधार",
  "खाता खेसरा क्या होता है"
];

export default function BlogPage() {
  // 1. Convert the posts object into an array so we can map() over it
  const allPosts = Object.keys(posts).map((slug) => ({
    slug,
    ...posts[slug],
  }));

  // 2. Set the Featured Post (Automatically takes the Prapatra-2 post)
  const featuredPost = allPosts.find(p => p.slug === "bihar-survey-prapatra-2-kaise-bhare") || allPosts[0];
  const FeaturedIcon = featuredPost.icon || FileText; // Fallback icon

  // 3. Remove the featured post from the grid so it doesn't show twice
  const gridPosts = allPosts.filter(p => p.slug !== featuredPost.slug);

  return (
    <div className="bg-slate-50 min-h-screen py-14 px-4 mt-2">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-2 w-fit mx-auto">
            <BookOpen size={14}/>
            Survey Knowledge Center
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 mb-4 text-slate-900">
            बिहार सर्वे <span className="text-blue-600">जानकारी</span>
          </h1>
          <p className="text-sm md:text-lg text-slate-500 max-w-xl mx-auto">
            जमीन सर्वे फॉर्म, वंशावली, आपत्ति आवेदन और अन्य प्रक्रियाओं को आसान भाषा में समझें।
          </p>
        </div>

        {/* HOT TOPICS */}
        <div className="bg-white border rounded-2xl p-4 md:p-6 mb-12">
          <div className="flex items-center gap-2 mb-4 font-semibold text-slate-800">
            <Flame className="text-red-500" size={18}/>
            Hot Topics
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {hotTopics.map((topic, index) => (
              <span key={index} className="whitespace-nowrap bg-slate-100 hover:bg-blue-100 hover:text-blue-700 cursor-pointer px-4 py-2 rounded-lg text-xs md:text-sm transition">
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* FEATURED ARTICLE */}
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="block bg-purple-200 text-blue-900 rounded-3xl md:rounded-3xl p-6 md:p-10 mb-12 hover:shadow-xl transition"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            <FeaturedIcon size={44} />
            <div>
              <span className="bg-blue-200 border px-3 py-1 rounded-full text-xs font-semibold">
                Featured Guide
              </span>
              <h2 className="text-xl md:text-3xl font-bold mt-3 mb-2">
                {featuredPost.title}
              </h2>
              {/* Note: We use .intro instead of .desc now, because that's what is in data/posts.js */}
              <p className="opacity-90 text-sm md:text-base max-w-xl line-clamp-2">
                {featuredPost.intro}
              </p>
              <div className="mt-3 font-semibold text-sm">
                पूरा लेख पढ़ें →
              </div>
            </div>
          </div>
        </Link>

        {/* BLOG GRID */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
          {gridPosts.map((post) => {
            // Fallbacks just in case you forget to add an icon or tag in data/posts.js
            const Icon = post.icon || FileText; 
            const postTag = post.tag || "सर्वे जानकारी"; 

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 md:p-6 hover:shadow-xl transition hover:bg-green-50 flex flex-col"
              >
                <Icon className="text-blue-600 mb-3" size={26}/>
                <div>
                  <span className="text-xs font-semibold bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                    {postTag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mt-3 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-grow">
                  {post.intro}
                </p>
                <div className="mt-4 text-blue-600 font-semibold text-sm">
                  पढ़ें →
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 bg-white border rounded-2xl md:rounded-3xl p-8 md:p-12 text-center shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            बिहार सर्वे फॉर्म ऑनलाइन बनाएं
          </h2>
          <p className="text-sm md:text-base text-slate-500 mb-6 max-w-xl mx-auto">
            अब सर्वे से जुड़े सभी आवेदन और दस्तावेज़ कुछ ही मिनटों में ऑनलाइन तैयार करें।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/forms" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              सभी सर्वे फॉर्म देखें
            </Link>
            <ShareButton/>
          </div>
        </div>
        
        <div className="mt-4">
          <CompactQuickLinks/>
        </div>
          <WhatsAppButton/>
      </div>
    </div>
  );
}