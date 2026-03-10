import Link from "next/link";
import CompactQuickLinks from "@/components/QuickLinksFooter";
import {
  FileText,
  TreePine,
  AlertTriangle,
  PenLine,
  Files,
  Flame,
  BookOpen
} from "lucide-react";
import ShareButton from "@/components/ShareButton";

const featuredPost = {
  title: "बिहार सर्वे प्रपत्र-2 कैसे भरें (पूरा गाइड)",
  slug: "prapatra-2-kaise-bhare",
  desc: "प्रपत्र-2 बिहार भूमि सर्वे का सबसे महत्वपूर्ण फॉर्म है। इस गाइड में आप सीखेंगे कि इसे सही तरीके से कैसे भरें।",
  icon: FileText
};

const posts = [
  {
    title: "डिजिटल वंशावली कैसे बनाएं",
    slug: "bihar-survey-vanshavali-kaise-banaye",
    desc: "परिवार की पूरी वंशावली बनाएं और तुरंत PDF डाउनलोड करें।",
    icon: TreePine,
    tag: "वंशावली"
  },
  {
    title: "सर्वे आपत्ति आवेदन कैसे करें",
    slug: "bihar-survey-objection-application",
    desc: "अगर सर्वे में नाम या जमीन की जानकारी गलत हो जाए तो सुधार कैसे करें।",
    icon: AlertTriangle,
    tag: "आपत्ति आवेदन"
  },
  {
    title: "परिमार्जन प्रक्रिया",
    slug: "bihar-survey-parimarjan-process",
    desc: "सर्वे रिकॉर्ड में गलती सुधारने की पूरी प्रक्रिया समझें।",
    icon: PenLine,
    tag: "परिमार्जन"
  },
  {
    title: "सर्वे के लिए जरूरी दस्तावेज",
    slug: "bihar-survey-required-documents",
    desc: "बिहार सर्वे में किन-किन दस्तावेजों की जरूरत पड़ती है।",
    icon: Files,
    tag: "दस्तावेज"
  },
  {
    title: "जमीन बंटवारा आवेदन कैसे करें",
    slug: "bihar-jamin-batwara-application",
    desc: "परिवार की जमीन का कानूनी बंटवारा करने के लिए आवेदन कैसे करें।",
    icon: FileText,
    tag: "बंटवारा"
  },
  {
    title: "जमाबंदी रद्द करने का आवेदन",
    slug: "jamabandi-cancellation-application",
    desc: "अगर जमीन गलत व्यक्ति के नाम हो गई है तो उसे रद्द कैसे करें।",
    icon: AlertTriangle,
    tag: "जमाबंदी"
  },
  {
    title: "बिहार सर्वे शपथ पत्र कैसे बनाएं",
    slug: "bihar-survey-shapath-patra",
    desc: "सर्वे में शपथ पत्र कब जरूरी होता है और इसे कैसे बनाएं।",
    icon: FileText,
    tag: "शपथ पत्र"
  },
  {
    title: "बिहार सर्वे स्टेटस कैसे देखें",
    slug: "bihar-survey-status-check",
    desc: "अपने सर्वे आवेदन का स्टेटस ऑनलाइन कैसे चेक करें।",
    icon: Files,
    tag: "सर्वे स्टेटस"
  },
  {
    title: "CO और कर्मचारी हड़ताल से सर्वे कार्य पर असर",
    slug: "bihar-co-karmchari-hartal",
    desc: "जानिए CO ऑफिस हड़ताल का जमीन सर्वे और आवेदन पर क्या असर पड़ता है।",
    icon: AlertTriangle,
    tag: "ताजा खबर"
  }
];

const hotTopics = [
  "बिहार सर्वे प्रपत्र-2 कैसे भरें",
  "बिहार सर्वे वंशावली कैसे बनाएं",
  "बिहार सर्वे आपत्ति आवेदन",
  "बिहार सर्वे परिमार्जन प्रक्रिया",
  "बिहार सर्वे में कौन-कौन से दस्तावेज चाहिए",
  "बिहार जमीन बंटवारा आवेदन",
  "जमाबंदी रद्द करने का आवेदन",
  "बिहार सर्वे शपथ पत्र"
];

export default function BlogPage() {

  const FeaturedIcon = featuredPost.icon;

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
            बिहार सर्वे
            <span className="text-blue-600"> जानकारी</span>
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
              <span
                key={index}
                className="whitespace-nowrap bg-slate-100 hover:bg-blue-100 hover:text-blue-700 cursor-pointer px-4 py-2 rounded-lg text-xs md:text-sm transition"
              >
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

              <p className="opacity-90 text-sm md:text-base max-w-xl">
                {featuredPost.desc}
              </p>

              <div className="mt-3 font-semibold text-sm">
                पूरा लेख पढ़ें →
              </div>

            </div>

          </div>

        </Link>

        {/* BLOG GRID */}

        <div className=" mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">

          {posts.map((post) => {

            const Icon = post.icon;

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 md:p-6 hover:shadow-xl transition hover:bg-green-50"
              >

                <Icon className="text-blue-600 mb-3" size={26}/>

                <span className="text-xs font-semibold bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                  {post.tag}
                </span>

                <h3 className="text-lg font-bold text-slate-800 mt-3 mb-2 group-hover:text-blue-600 transition">
                  {post.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {post.desc}
                </p>

                <div className="mt-3 text-blue-600 font-semibold text-sm">
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

            <Link
              href="/forms"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              सभी सर्वे फॉर्म देखें
            </Link>

            <ShareButton/>

          </div>

        </div>
          <div className="mt-4">
            <CompactQuickLinks/>
          </div>
      </div>

    </div>
  );
}