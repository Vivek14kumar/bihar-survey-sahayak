import Link from "next/link";
import { locations } from "@/app/data/locations";
import ShareButton from "@/components/ShareButton";
import { notFound } from "next/navigation";
import CompactQuickLinks from "@/components/QuickLinksFooter";
import { 
  FileText, 
  GitBranch, 
  Gavel, 
  AlertCircle, 
  Users, 
  Edit3, 
  Trash2, 
  FileArchive,
  ArrowRight,
  Info
} from "lucide-react";

export const revalidate = 86400;

export async function generateStaticParams() {
  const districts = [...new Set(locations.map(l => l.district))];

  return districts.map((district) => ({
    district
  }));
}

export async function generateMetadata({ params }) {

  const { district } = await params;

  const districtName =
    district.charAt(0).toUpperCase() + district.slice(1);

  return {
    title: `${districtName} Bihar Survey 2026 | प्रपत्र-2, वंशावली, आपत्ति आवेदन`,
    description: `${districtName} जिला बिहार भूमि सर्वे 2026 की पूरी जानकारी। प्रपत्र-2, वंशावली, आपत्ति आवेदन ऑनलाइन बनाएं और PDF डाउनलोड करें।`,
    keywords: `${districtName} Bihar survey, ${districtName} भूमि सर्वे, ${districtName} प्रपत्र 2`
  };

}

export default async function DistrictPage({ params }) {
  const { district } = await params;
  const districts = [...new Set(locations.map(l => l.district))];

if (!districts.includes(district)) {
  notFound();
}
  const districtName = district.charAt(0).toUpperCase() + district.slice(1);

  const tools = [
    { name: "प्रपत्र-2 (Self Declaration)", url: "/prapatra-2", icon: <FileText className="text-blue-600" />, color: "bg-blue-50", desc: "रैयत द्वारा स्वघोषणा पत्र भरने के लिए।" },
    { name: "वंशावली (Genealogy)", url: "/#tool", icon: <GitBranch className="text-emerald-600" />, color: "bg-emerald-50", desc: "पूर्वजों की वंशावली ट्री बनाने के लिए।" },
    { name: "शपथ पत्र (Affidavit)", url: "/shapath-patra", icon: <Gavel className="text-purple-600" />, color: "bg-purple-50", desc: "भूमि स्वामित्व हेतु शपथ पत्र जनरेट करें।" },
    { name: "आपत्ति आवेदन (Objection)", url: "/objection-letter", icon: <AlertCircle className="text-red-600" />, color: "bg-red-50", desc: "सर्वे में गलत प्रविष्टि पर आपत्ति दर्ज करें।" },
    { name: "बंटवारा आवेदन", url: "/batwara-application-bihar", icon: <Users className="text-orange-600" />, color: "bg-orange-50", desc: "पारिवारिक भूमि बंटवारे का ड्राफ्ट तैयार करें।" },
    { name: "परिमार्जन सहायता", url: "/parimarjan-help" , icon: <Edit3 className="text-cyan-600" />, color: "bg-cyan-50", desc: "डिजिटलाइज्ड जमाबंदी में सुधार हेतु।" },
    { name: "जमाबंदी रद्द आवेदन", url: "/cancellation-jamabandhi", icon: <Trash2 className="text-rose-600" />, color: "bg-rose-50", desc: "गलत जमाबंदी रद्द करने हेतु आवेदन।" },
    { name: "PDF Tools", url: "/pdf-toolkit", icon: <FileArchive className="text-indigo-600" />, color: "bg-indigo-50", desc: "दस्तावेजों को कंप्रेस या मर्ज करने के लिए।" },
  ];

  const blocks = locations.filter(
  (loc) => loc.district === district
);
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans">
      
      {/* Header Section */}
      <header className="text-center mb-12">
        <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
          Bihar Bhumi Survey 2026
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-4">
          Bihar Survey Forms – <span className="text-blue-600">{districtName}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
          {districtName} जिला के रैयतों के लिए बिहार भूमि सर्वे फॉर्म भरने का सबसे आसान तरीका। 
          <span className="block mt-2 font-medium text-gray-800 italic">"फॉर्म चुनें, जानकारी भरें और तुरंत PDF डाउनलोड करें।"</span>
        </p>
      </header>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {tools.map((tool, i) => (
          <Link
            key={i}
            href={tool.url}
            className={`group relative p-6 rounded-2xl border border-transparent hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 ${tool.color}`}
          >
            <div className="mb-4 inline-block p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{tool.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{tool.desc}</p>
            <div className="flex items-center text-blue-600 font-semibold text-sm">
              अभी भरें <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
        <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h2 className="uppercase text-3xl font-bold mb-6 p-1 border-b-2 border-gray-200 rounded-xl">
        <span className="text-blue-600">{districtName}</span> के ब्लॉक :-
        </h2>

        <div className="flex flex-wrap gap-2">

        {blocks.flatMap((item) =>
        item.blocks.map((block, i) => (
        
        <Link
        key={i}
        href={`/survey/${district}/${block}`}
        className="capitalize px-4 py-2 bg-purple-50  border-b-2 border-purple-400 text-gray-700 font-bold rounded-lg hover:bg-purple-200"
        >
        {block}
        
        </Link>

        ))
        )}

        </div>
      </section>
      {/* Info Section - "How it works" */}
      <section className="mt-20 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
            <Info className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-bold">सर्वे फॉर्म कैसे भरें? (Easy Steps)</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-100">01</div>
                <h4 className="font-bold">फॉर्म का चयन करें</h4>
                <p className="text-gray-600 text-sm">अपनी जरूरत के अनुसार वंशावली या प्रपत्र-2 का चयन करें।</p>
            </div>
            <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-100">02</div>
                <h4 className="font-bold">विवरण भरें</h4>
                <p className="text-gray-600 text-sm">खाता, खेसरा, रकबा और अपने पूर्वजों की सही जानकारी दर्ज करें।</p>
            </div>
            <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-100">03</div>
                <h4 className="font-bold">प्रिंट और जमा करें</h4>
                <p className="text-gray-600 text-sm">PDF डाउनलोड करें, हस्ताक्षर करें और अपने शिविर (Camp) में जमा करें।</p>
            </div>
        </div>
      </section>

      {/* Share Section */}
      <div className="mt-12 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">
          गाँव के लोगों की मदद करें!
        </h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          अक्सर जानकारी के अभाव में लोग सर्वे फॉर्म नहीं भर पाते। इस वेबसाइट को WhatsApp पर शेयर करें ताकि हर कोई आसानी से अपना फॉर्म तैयार कर सके।
        </p>
        <div className="inline-block transform hover:scale-105 transition">
            <ShareButton />
        </div>
      </div>
       <div className="mt-4">
         <CompactQuickLinks/>
       </div>
    </div>
  );
}