import Link from "next/link";
import { notFound } from "next/navigation";
import { locations } from "@/app/data/locations";
import ShareButton from "@/components/ShareButton";
import CompactQuickLinks from "@/components/QuickLinksFooter";
import { 
  FileText, 
  GitBranch, 
  Gavel, 
  Users, 
  Edit3, 
  AlertCircle,
  MapPin,
  ArrowRight,
  ClipboardList
} from "lucide-react";


export async function generateStaticParams() {

  return locations.map((loc) => ({
    district: loc.district,
    block: loc.block
  }));

}

export async function generateMetadata({ params }) {

  const { district, block } = await params;

  const districtName =
    district.charAt(0).toUpperCase() + district.slice(1);

  const blockName =
    block.charAt(0).toUpperCase() + block.slice(1);

  return {
    title: `सर्वे फॉर्म ${blockName} (${districtName}) | प्रपत्र-2, वंशावली, आपत्ति आवेदन`,
    description: `${blockName} प्रखंड (${districtName}) के लिए बिहार भूमि सर्वे फॉर्म ऑनलाइन बनाएं – प्रपत्र-2, वंशावली, शपथ पत्र, आपत्ति आवेदन।`
  };

}

export default async function SurveyPage({ params }) {
  const { district, block } = await params;

  const validBlock = locations.find(
    (l) => l.district === district && l.block === block
  );

  if (!validBlock) {
    notFound();
  }

  const districtName = district.charAt(0).toUpperCase() + district.slice(1);
  const blockName = block.charAt(0).toUpperCase() + block.slice(1);

  const tools = [
    { name: "प्रपत्र-2 (Self Declaration)", url: "/prapatra-2", icon: <FileText className="text-blue-600" />, color: "bg-blue-50", desc: "रैयत द्वारा स्वघोषणा पत्र भरने के लिए।" },
    { name: "वंशावली (Genealogy)", url: "/#tool", icon: <GitBranch className="text-emerald-600" />, color: "bg-emerald-50", desc: "पूर्वजों की वंशावली ट्री बनाने के लिए।" },
    { name: "शपथ पत्र (Affidavit)", url: "/shapath-patra", icon: <Gavel className="text-purple-600" />, color: "bg-purple-50", desc: "भूमि स्वामित्व हेतु शपथ पत्र जनरेट करें।" },
    { name: "बंटवारा आवेदन", url: "/batwara-application-bihar", icon: <Users className="text-orange-600" />, color: "bg-orange-50", desc: "पारिवारिक भूमि बंटवारे का ड्राफ्ट तैयार करें।" },
    { name: "परिमार्जन सहायता", url: "/parimarjan-help" , icon: <Edit3 className="text-cyan-600" />, color: "bg-cyan-50", desc: "डिजिटलाइज्ड जमाबंदी में सुधार हेतु।" },
    { name: "आपत्ति आवेदन (Objection)", url: "/objection-letter", icon: <AlertCircle className="text-red-600" />, color: "bg-red-50", desc: "सर्वे में गलत प्रविष्टि पर आपत्ति दर्ज करें।" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans">
      
      {/* Header Section */}
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="text-orange-600 w-5 h-5" />
            <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                Bihar Bhumi Survey 2026
            </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-4">
          सर्वे फॉर्म: प्रखंड <span className="text-blue-600">{blockName}</span> ({districtName})
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
          {blockName} प्रखंड ({districtName}) के रैयतों के लिए बिहार भूमि सर्वे फॉर्म भरने का सबसे आसान तरीका।
          <span className="block mt-2 font-medium text-gray-800 italic">"फॉर्म चुनें, जानकारी भरें और तुरंत PDF डाउनलोड करें।"</span>
        </p>
      </header>

      {/* Tools Grid - Exact same design as District Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Info Section - Checklist style for this level */}
      <section className="mt-20 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="text-blue-500 w-7 h-7" />
            <h2 className="text-2xl font-bold">फॉर्म भरने से पहले ये दस्तावेज़ तैयार रखें</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-gray-700">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="text-blue-500 w-5 h-5" />
                <span>अपडेट लगान रसीद (Up-to-date Land Tax Receipt)</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="text-blue-500 w-5 h-5" />
                <span>जमीन का खतियान या केवाला (Khatiyan or Sale Deed)</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="text-blue-500 w-5 h-5" />
                <span>वंशावली (Genealogy Tree) - सरपंच/मुखिया द्वारा हस्ताक्षरित</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="text-blue-500 w-5 h-5" />
                <span>सभी हिस्सेदारों के आधार कार्ड (Aadhar of all stakeholders)</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="text-blue-500 w-5 h-5" />
                <span>बंटवारानामा (यदि जमीन का औपचारिक बंटवारा हुआ हो)</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <AlertCircle className="text-red-500 w-5 h-5" />
                <span className="font-medium">नोट: सभी प्रपत्रों पर हस्ताक्षर अवश्य करें।</span>
            </div>
        </div>
      </section>

      {/* Share Section */}
      <div className="mt-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">
          प्रखंड के अन्य लोगों की मदद करें!
        </h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          जानकारी के अभाव में लोग सर्वे फॉर्म नहीं भर पाते। इस वेबसाइट को WhatsApp पर शेयर करें ताकि प्रखंड {blockName} के हर रैयत को आसानी हो।
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