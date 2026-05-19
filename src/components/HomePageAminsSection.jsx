// components/HomePageAminsSection.js
// ✅ Server Component

import dbConnect from "@/app/api/utils/dbConnect";
import Amin from "@/app/api/models/AminProfile";
import AminDirectoryCard from "./AminDirectoryCard";

import {
  Users,
  Search,
  MapPin,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

import Link from "next/link";

export default async function HomePageAminsSection() {
  // Database Connect
  await dbConnect();

  // Fetch Amins
  const aminsData = await Amin.find({
    status: "live",
    isProfilePublished: true,
  })
    .select("-about -rejectionReason")
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  // Safe JSON Data
  const amins = JSON.parse(JSON.stringify(aminsData));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f9ff] to-[#f8fafc] py-16 sm:py-20">

      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-200/30 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-200/30 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADING ================= */}
        <div className="text-center mb-12">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-cyan-100 shadow-sm text-cyan-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles size={14} />
            अपने क्षेत्र के अमीन से संपर्क करें
          </div>

          {/* Heading बिहार के अनुभवी अमीन*/}
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            उपलब्ध अमीन 
          </h2>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            बिहार में जमीन मापी, सीमांकन, बंटवारा और सर्वे संबंधित
            सेवाओं के लिए अनुभवी एवं सत्यापित अमीन खोजें।
          </p>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="mb-10">

          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-4 sm:p-5 shadow-lg">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* Search */}
              <div className="relative md:col-span-2">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="जिला, क्षेत्र या अमीन नाम खोजें..."
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
              <select
                className="
                h-12 rounded-2xl
                border border-slate-200
                bg-white px-4
                text-sm text-slate-700
                outline-none
                focus:ring-4 focus:ring-cyan-100
                focus:border-cyan-400
                transition-all
              "
              >
                <option>सभी सेवाएं</option>
                <option>जमीन मापी</option>
                <option>सीमांकन</option>
                <option>बंटवारा</option>
                <option>सर्वे सहायता</option>
              </select>

              {/* Verified Filter */}
              <button
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
                Search
              </button>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">

          {[
            {
              icon: <Users size={20} />,
              title: "Registered Amin",
              value: `${amins.length}+`,
            },
            {
              icon: <BadgeCheck size={20} />,
              title: "Verified Profiles",
              value: "100%",
            },
            {
              icon: <MapPin size={20} />,
              title: "Service Areas",
              value: "Bihar",
            },
            {
              icon: <Sparkles size={20} />,
              title: "Trusted Services",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

          {amins.length > 0 ? (
            amins.map((profile) => (
              <AminDirectoryCard
                key={profile._id}
                profile={profile}
              />
            ))
          ) : (
            <div className="col-span-full">

              <div className="bg-white rounded-3xl p-10 text-center shadow-lg border border-slate-100">

                <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center">
                  <Users size={34} className="text-slate-400" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  कोई अमीन उपलब्ध नहीं है
                </h3>

                <p className="mt-2 text-slate-500">
                  वर्तमान में कोई लाइव अमीन प्रोफाइल उपलब्ध नहीं है।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================= CTA ================= */}
        <div className="mt-14 text-center">

          <Link
            href="/amins"
            className="
            inline-flex items-center gap-2
            px-7 py-4
            rounded-2xl
            bg-gradient-to-r from-slate-900 to-slate-700
            text-white
            font-bold
            shadow-xl
            hover:scale-105
            hover:shadow-2xl
            transition-all
          "
          >
            सभी अमीन देखें
          </Link>
        </div>
      </div>
    </section>
  );
}