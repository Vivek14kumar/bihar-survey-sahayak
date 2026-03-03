"use client";

import Link from "next/link";
import Image from "next/image";

export default function FormsPage() {

  const forms = [
    {
      title: "प्रपत्र-2",
      description: "जमीन सर्वे हेतु आवश्यक मुख्य फॉर्म",
      link: "/prapatra-2",
      image: "/forms/prapatra2.jpeg"
    },
    {
      title: "शपथ-पत्र",
      description: "घोषणा हेतु शपथ पत्र तैयार करें",
      link: "/shapath-patra",
      image: "/forms/shapaths.jpeg"
    },
    {
      title: "आपत्ति पत्र",
      description: "सर्वे आपत्ति दर्ज करने हेतु आवेदन",
      link: "/objection-letter",
      image: "/forms/objections.jpeg"
    },
    {
      title: "जमाबन्दी रद्दकरन पत्र ",
      description: "जमाबन्दी के रद्दकरन हेतु याचिका पत्र ",
      link: "/cancellation-jamabandhi",
      image: "/forms/cancellation-jama.jpeg"
    },
    {
      title: "वंशावली",
      description: "परिवार वृक्ष / वंश सूची तैयार करें",
      link: "/#tool",
      image: "/forms/familytree.jpeg"
    }
  ];

  return (
    <div className="relative min-h-screen py-24 px-6 overflow-hidden">

      {/* 🌸 Light Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>

      {/* 🌈 Soft Floating Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 -z-10"></div>

      {/* 🏷 Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center p-2 tracking-wide bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
        अब सर्वे फॉर्म भरना हुआ आसान और परेशानी मुक्त
      </h1>
      
      <p className="text-center text-lg md:text-lg text-gray-600 font-bold max-w-3xl mx-auto leading-relaxed mb-6">
        लंबी लाइन, गलतियां और हाथ से लिखने की झंझट अब खत्म। 
        अपने घर बैठे सभी सर्वे फॉर्म कुछ ही मिनटों में ऑनलाइन भरें 
        और तुरंत प्रिंट करें।
      </p>

      {/* 📦 Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">

        {forms.map((form, index) => (
          <div
            key={index}
            className="group rounded-3xl overflow-hidden bg-white/70 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white"
          >

            {/* Image */}
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src={form.image}
                alt={form.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                {form.title}
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {form.description}
              </p>

              <Link href={form.link}>
                <button className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all duration-300 shadow-md">
                  अभी भरे / Fill Now →
                </button>
              </Link>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}