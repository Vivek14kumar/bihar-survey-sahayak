"use client";

import React from "react";
import {
  Sparkles,
  CalendarDays,
  ShieldAlert,
  Clock3,
  MapPin,
  TrendingUp,
  Flame,
} from "lucide-react";
import Image from "next/image";


export default function ViralDistrictUpdatePage() {
  const updates = [
    {
      id: 1,
      date: "25 मई 2026",
      day: "सोमवार",
      districts: "पश्चिम चंपारण, सहरसा, वैशाली",
      level: "High Alert",
      color: "from-red-500 to-pink-500",
    },
    {
      id: 2,
      date: "26 मई 2026",
      day: "मंगलवार",
      districts: "कटिहार, पूर्वी चंपारण, गोपालगंज",
      level: "Monitoring",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 3,
      date: "27 मई 2026",
      day: "बुधवार",
      districts: "सुपौल, रोहतास, पटना",
      level: "Special Review",
      color: "from-pink-500 to-purple-500",
    },
    {
      id: 4,
      date: "29 मई 2026",
      day: "शुक्रवार",
      districts: "गया, जहानाबाद, औरंगाबाद",
      level: "Department Review",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: 5,
      date: "1 जून 2026",
      day: "सोमवार",
      districts: "शिवहर, सीवान, बेगूसराय",
      level: "Important",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: 6,
      date: "2 जून 2026",
      day: "मंगलवार",
      districts: "अररिया, लखीसराय, जमुई",
      level: "District Watch",
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: 7,
      date: "3 जून 2026",
      day: "बुधवार",
      districts: "सारण, नवादा, भागलपुर",
      level: "Live Monitoring",
      color: "from-emerald-500 to-green-500",
    },
    {
      id: 8,
      date: "4 जून 2026",
      day: "गुरुवार",
      districts: "मुजफ्फरपुर, बक्सर, बांका",
      level: "Department Alert",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 9,
      date: "5 जून 2026",
      day: "शुक्रवार",
      districts: "भोजपुर, मधेपुरा, अरवल",
      level: "Special Focus",
      color: "from-amber-500 to-orange-500",
    },
    {
      id: 10,
      date: "8 जून 2026",
      day: "सोमवार",
      districts: "मुंगेर, पूर्णिया, कैमूर",
      level: "Survey Review",
      color: "from-sky-500 to-cyan-500",
    },
    {
      id: 11,
      date: "9 जून 2026",
      day: "मंगलवार",
      districts: "नालंदा, खगड़िया, समस्तीपुर",
      level: "Administrative Review",
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      id: 12,
      date: "10 जून 2026",
      day: "बुधवार",
      districts: "मधुबनी, किशनगंज, सीतामढ़ी",
      level: "Ground Inspection",
      color: "from-lime-500 to-green-500",
    },
    {
      id: 13,
      date: "11 जून 2026",
      day: "गुरुवार",
      districts: "दरभंगा, शेखपुरा",
      level: "Final Review",
      color: "from-red-500 to-orange-500",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8f7]">

      {/* ================================================= */}
      {/* HERO SECTION */}
      {/* ================================================= */}

      <section className="relative overflow-hidden">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
         
        > <Image
          src="/assets/monitoring.webp"
          alt="Bihar Survey Background Desktop"
          fill
          priority
          sizes="100vw"
          className="hidden md:block object-cover object-center"
        />

      {/* Mobile Image 9:16 (Block on mobile, hidden on md screens and up) */}
          <Image
            src="/assets/monitoring-mobile.webp" 
            alt="Bihar Survey Background Mobile"
            fill
            priority
            sizes="100vw"
            className="block md:hidden object-cover object-center"
          />
        </div>

       {/* Premium Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />

        {/* Glow Effects 
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl" />
            */}
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">

          {/* Badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">

            <Sparkles className="text-yellow-300" size={18} />

            <span className="text-sm font-bold tracking-wide text-white">
              LIVE DISTRICT MONITORING 2026
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mx-auto mt-6 max-w-5xl text-center text-4xl font-black leading-tight text-white md:text-7xl">

            आज किन जिलों में होगी
            <span className="block text-yellow-300">
              बड़ी समीक्षा और सख्ती?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-red-100 md:text-xl">
            जिलेवार समीक्षा, प्रशासनिक गतिविधियों, सर्वे निगरानी एवं विभागीय अपडेट की महत्वपूर्ण जानकारी।
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 md:flex md:flex-wrap md:items-center md:justify-center">

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white">
                <TrendingUp className="text-yellow-300" />
                <div>
                  <h4 className="font-black text-2xl">38+</h4>
                  <p className="text-xs text-red-100 md:text-sm">
                    District Updates
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white">
                <Clock3 className="text-yellow-300" />
                <div>
                  <h4 className="font-black text-2xl">4PM</h4>
                  <p className="text-xs text-red-100 md:text-sm">
                    Review Starts
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white">
                <ShieldAlert className="text-yellow-300" />
                <div>
                  <h4 className="font-black text-2xl">LIVE</h4>
                  <p className="text-xs text-red-100 md:text-sm">
                    Monitoring
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white">
                <Flame className="text-yellow-300" />
                <div>
                  <h4 className="font-black text-2xl">HOT</h4>
                  <p className="text-xs text-red-100 md:text-sm">
                    Viral Updates
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* UPDATE CARDS */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-3 py-10 md:px-4">

        {/* Heading */}
        <div className="mb-8 text-center">

          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
            <Flame size={16} />
            MOST SHARED DISTRICT UPDATES
          </div>

          <h2 className="mt-5 text-3xl font-black text-gray-900 md:text-5xl">
            District Review Schedule
          </h2>

          <p className="mt-3 text-gray-600">
            जिलेवार समीक्षा एवं प्रशासनिक गतिविधियों की सूची
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {updates.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(255,0,0,0.18)] md:p-6"
            >

              {/* Top Gradient */}
              <div className={`absolute top-0 left-0 h-2 w-full bg-gradient-to-r ${item.color}`} />

              {/* Glow */}
              <div className={`absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-r ${item.color} opacity-10 blur-3xl`} />

              {/* Badge */}
              <div className={`inline-flex rounded-full bg-gradient-to-r ${item.color} px-3 py-1 text-[10px] font-bold text-white shadow-md md:px-4 md:text-xs`}>
                {item.level}
              </div>

              {/* Date */}
              <div className="mt-4 flex items-start justify-between">

                <div>
                  <h3 className="text-lg font-black leading-tight text-gray-900 md:text-2xl">
                    {item.date}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-gray-500 md:text-sm">
                    {item.day}
                  </p>
                </div>

                <div className={`rounded-2xl bg-gradient-to-r ${item.color} p-2 text-white shadow-lg md:p-3`}>
                  <CalendarDays size={18} />
                </div>
              </div>

              {/* Districts */}
              <div className="mt-5 rounded-2xl bg-gray-50 p-3 md:p-5">

                <div className="flex items-start gap-3">

                  <div className={`rounded-xl bg-gradient-to-r ${item.color} p-2 text-white`}>
                    <MapPin size={15} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 md:text-xs">
                      Districts
                    </p>

                    <h4 className="mt-1 text-sm font-bold leading-relaxed text-gray-800 md:text-lg">
                      {item.districts}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-5 flex items-center justify-between">

                <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500 md:text-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </div>

                <button className={`rounded-xl bg-gradient-to-r ${item.color} px-3 py-2 text-[10px] font-bold text-white shadow-md transition-all duration-300 hover:scale-105 md:px-4 md:text-sm`}>
                  View
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 overflow-hidden rounded-[32px] border border-yellow-200 bg-gradient-to-r from-yellow-100 via-orange-50 to-red-50 p-6 shadow-lg">

          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">

            <div className="rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white shadow-lg">
              <ShieldAlert size={30} />
            </div>

            <div>
              <h3 className="text-2xl font-black text-gray-900">
                महत्वपूर्ण प्रशासनिक सूचना
              </h3>

              <p className="mt-2 max-w-4xl leading-relaxed text-gray-700">
                सभी जिलाधिकारियों (DM), अंचलाधिकारियों (CO) एवं संबंधित अधिकारियों को निर्धारित तिथि पर रिपोर्ट एवं प्रगति विवरण के साथ वीडियो कॉन्फ्रेंसिंग में शामिल होना अनिवार्य है।
              </p>
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}