
import dbConnect from "@/app/api/utils/dbConnect";
import Amin from "@/app/api/models/AminProfile";

import {
  Search,
  MapPin,
  Users,
  Sparkles,
  Filter,
} from "lucide-react";

import AminDirectoryCard from "@/components/AminDirectoryCard";

export const metadata = {
  title: "Bihar Amin Directory",
  description:
    "Find experienced amin professionals for जमीन मापी, सीमांकन, बंटवारा and survey services across Bihar.",
};

export default async function AllAminsPage({ searchParams }) {
  await dbConnect();

  const search = searchParams?.search || "";
  const service = searchParams?.service || "";

  // Query
  let query = {
    status: "live",
    isProfilePublished: true,
  };

  // Search by name or area
  if (search) {
    query.$or = [
      {
        ownerNameHi: {
          $regex: search,
          $options: "i",
        },
      },
      {
        ownerNameEn: {
          $regex: search,
          $options: "i",
        },
      },
      {
        serviceAreas: {
          $elemMatch: {
            $regex: search,
            $options: "i",
          },
        },
      },
    ];
  }

  // Service filter
  if (service) {
    query[`services.${service}`] = true;
  }

  const aminsData = await Amin.find(query)
    .select("-about -rejectionReason")
    .sort({ createdAt: -1 })
    .lean();

  const amins = JSON.parse(JSON.stringify(aminsData));

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#f8fafc] py-14 sm:py-20">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-200/30 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-200/30 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= HEADING ================= */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-cyan-100 shadow-sm text-cyan-700 text-xs font-bold tracking-wider uppercase">
            <Users size={14} />
            Bihar Amin Directory
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            बिहार के उपलब्ध अमीन
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            जमीन मापी, सीमांकन, बंटवारा और सर्वे संबंधित
            सेवाओं के लिए बिहार के अनुभवी अमीन खोजें।
          </p>
        </div>

        {/* ================= FILTER BAR ================= */}
        <form
          action="/amins"
          className="mb-12 bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-4 sm:p-5 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="नाम, जिला या क्षेत्र खोजें..."
                className="
                w-full h-12 rounded-2xl
                border border-slate-200
                bg-white
                pl-11 pr-4
                text-sm
                outline-none
                focus:ring-4 focus:ring-cyan-100
                focus:border-cyan-400
                transition-all
              "
              />
            </div>

            {/* Service Filter */}
            <div className="relative">
              <Filter
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                name="service"
                defaultValue={service}
                className="
                w-full h-12 rounded-2xl
                border border-slate-200
                bg-white
                pl-11 pr-4
                text-sm text-slate-700
                outline-none
                focus:ring-4 focus:ring-cyan-100
                focus:border-cyan-400
                transition-all
              "
              >
                <option value="">सभी सेवाएं</option>
                <option value="landMeasure">जमीन मापी</option>
                <option value="demarcation">सीमांकन</option>
                <option value="partition">बंटवारा</option>
                <option value="surveyHelp">सर्वे सहायता</option>
              </select>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="
              h-12 rounded-2xl
              bg-gradient-to-r from-sky-400 to-cyan-400
              text-slate-900
              font-bold text-sm
              shadow-lg
              hover:shadow-cyan-300/30
              hover:scale-[1.02]
              transition-all
              flex items-center justify-center gap-2
            "
            >
              <Search size={18} />
              अमीन खोजें
            </button>
          </div>
        </form>

        {/* ================= STATS ================= 
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: <Users size={20} />,
              title: "Available Amin",
              value: `${amins.length}+`,
            },
            {
              icon: <MapPin size={20} />,
              title: "Service Areas",
              value: "Bihar",
            },
            {
              icon: <Sparkles size={20} />,
              title: "Survey Services",
              value: "24x7",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="
              bg-white/70 backdrop-blur-xl
              border border-white
              rounded-3xl
              p-5
              shadow-md
              hover:shadow-xl
              transition-all
            "
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 text-slate-900 flex items-center justify-center shadow-md">
                {item.icon}
              </div>

              <h3 className="mt-4 text-2xl font-black text-slate-900">
                {item.value}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {item.title}
              </p>
            </div>
          ))}
        </div>*/}

        {/* ================= CARDS ================= */}
        {amins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {amins.map((profile) => (
              <AminDirectoryCard
                key={profile._id}
                profile={profile}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center shadow-lg border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center">
              <Users size={34} className="text-slate-400" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              कोई अमीन उपलब्ध नहीं है
            </h3>

            <p className="mt-2 text-slate-500">
              कृपया बाद में पुनः प्रयास करें।
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
