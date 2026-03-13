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

export const metadata = {
  title: "बिहार सर्वे जानकारी | Bihar Survey Guide",
  description:
    "बिहार भूमि सर्वे से जुड़ी सभी जानकारी – प्रपत्र-2, वंशावली, आपत्ति आवेदन, परिमार्जन और जरूरी दस्तावेज।"
};

const featuredPost = {
  title: "बिहार सर्वे प्रपत्र-2 कैसे भरें (पूरा गाइड)",
  slug: "bihar-survey-prapatra-2-kaise-bhare",
  desc: "प्रपत्र-2 बिहार भूमि सर्वे का सबसे महत्वपूर्ण फॉर्म है। इस गाइड में आप सीखेंगे कि इसे सही तरीके से कैसे भरें।",
  icon: FileText
};

const posts = [
  {
  title: "अगर बिहार सर्वे में प्रपत्र-2 नहीं भरा तो क्या होगा",
  slug: "prapatra-2-na-bhare-to-kya-hoga",
  desc: "अगर किसी रैयत ने सर्वे के समय प्रपत्र-2 नहीं भरा तो भविष्य में क्या समस्या हो सकती है।",
  icon: AlertTriangle,
  tag: "महत्वपूर्ण"
},
{
  title: "बिहार सर्वे में नाम गलत हो जाए तो सुधार कैसे करें",
  slug: "bihar-survey-name-correction",
  desc: "सर्वे रिकॉर्ड में नाम या जानकारी गलत हो जाए तो उसे कैसे सही कराएं।",
  icon: PenLine,
  tag: "नाम सुधार"
},
{
  title: "बिहार सर्वे 2027 तक चलेगा – नया अपडेट",
  slug: "bihar-survey-2027-update",
  desc: "भूमि सर्वे की समय सीमा को लेकर नया अपडेट और रैयतों के लिए जरूरी जानकारी।",
  icon: FileText,
  tag: "नया अपडेट"
},
{
  title: "बिहार सर्वे में जमीन विवाद हो जाए तो क्या करें",
  slug: "bihar-survey-jamin-vivad",
  desc: "अगर सर्वे के दौरान जमीन पर विवाद हो जाए तो उसका समाधान कैसे करें।",
  icon: AlertTriangle,
  tag: "जमीन विवाद"
},
{
  title: "खाता और खेसरा नंबर क्या होता है",
  slug: "bihar-survey-khata-khesra",
  desc: "जमीन रिकॉर्ड में खाता और खेसरा नंबर का क्या महत्व होता है।",
  icon: FileText,
  tag: "जमीन जानकारी"
},
{
  title: "बिहार सर्वे के लिए ऑनलाइन फॉर्म कैसे बनाएं",
  slug: "bihar-survey-online-form",
  desc: "ऑनलाइन टूल की मदद से सर्वे फॉर्म कैसे बनाएं और PDF डाउनलोड करें।",
  icon: PenLine,
  tag: "ऑनलाइन फॉर्म"
},
{
  title: "बिहार सर्वे के दौरान जमीन बंटवारा प्रक्रिया",
  slug: "bihar-survey-batwara-process",
  desc: "अगर जमीन संयुक्त है तो सर्वे के दौरान बंटवारा कैसे करें।",
  icon: FileText,
  tag: "बंटवारा"
},
{
  title: "बिहार सर्वे में आपत्ति कैसे दर्ज करें",
  slug: "bihar-survey-aapatti-process",
  desc: "अगर सर्वे रिकॉर्ड में गलती हो जाए तो आपत्ति आवेदन कैसे दें।",
  icon: AlertTriangle,
  tag: "आपत्ति"
},
{
  title: "बिहार भूमि सर्वे में रैयतों के लिए जरूरी जानकारी",
  slug: "bihar-survey-raiayat-guide",
  desc: "भूमि सर्वे के दौरान रैयतों को किन बातों का ध्यान रखना चाहिए।",
  icon: FileText,
  tag: "रैयत गाइड"
},
{
  title:"सरकार का बड़ा फैसला: अब अंचलाधिकारी (CO) का काम भी संभालेंगे BDO",
  slug:"bdo-will-handle-co-work-update",
  des:"अब BDO के पास भी CO के बराबर की शक्तियां (Powers) होंगी। वे मुख्य रूप से ये काम करेंगे",
  icon: AlertTriangle,
  tag: "महत्वपूर्ण"
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
  "बिहार सर्वे शपथ पत्र",
  "बिहार सर्वे 2027 अपडेट",
  "प्रपत्र-2 नहीं भरा तो क्या होगा",
  "बिहार सर्वे में नाम सुधार",
  "खाता खेसरा क्या होता है"
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