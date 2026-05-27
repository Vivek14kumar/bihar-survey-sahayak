
import Link from "next/link";
import Image from "next/image";
import mongoose from "mongoose";
import {
  Map, Compass, FileSignature, Scale, Phone, MessageCircle, Lock,
  MapPin, ShieldCheck, Briefcase, Star, ChevronRight, Mail, Clock, Building2,
  Facebook, Instagram, Youtube, Home // Added social and home icons
} from "lucide-react";
import { cookies } from "next/headers";

import dbConnect from "@/app/api/utils/dbConnect";
import AminProfile from "@/app/api/models/AminProfile";
import User from "@/app/api/models/User";
import { cache } from 'react';
import ShareButton from "../ShareButton"; 
import CleanUrl from "../CleanUrl";
import ContactButtons from "../ContactButtons";
import ViewTracker from "../ViewTracker";
import { Kalam } from "next/font/google";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

// डेटाबेस क्वेरी को cache करने के लिए ताकि पेज और मेटाडेटा के लिए दो बार डेटाबेस कॉल न हो
const getAminProfile = cache(async (id) => {
  await dbConnect();
  let dbProfile = null;
  
  if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
    dbProfile = await AminProfile.findOne({ userId: id }).lean();
  }
  if (!dbProfile) {
    dbProfile = await AminProfile.findOne({ slug: id }).lean();
  }
  return dbProfile;
});

// ==========================================
// DYNAMIC METADATA FOR WHATSAPP/SOCIAL SHARE
// ==========================================
export async function generateMetadata(props) {
  const params = await props.params;
  const paramIdentifier = params.id; // This will match the "slug" field

  const dbProfile = await getAminProfile(paramIdentifier);

  if (!dbProfile) {
    return {
      title: "Profile Not Found | Bihar Survey Sahayak",
      description: "अमीन का प्रोफाइल नहीं मिला।"
    };
  }

  const aminNameHi = dbProfile.ownerNameHi || "अमीन";
  const aminNameEn = dbProfile.ownerNameEn || "Amin";
  
  // Create a location string from the array, e.g., "Patna, Danapur"
  const locations = dbProfile.serviceAreas && dbProfile.serviceAreas.length > 0 
    ? dbProfile.serviceAreas.join(", ") //[0]//
    : "बिहार";

  const title = `${aminNameHi} - Amin in ${locations} | Bihar Survey Sahayak`;
  
  // Use their actual "about" text if available, otherwise fallback to default
  const description = dbProfile.about || `${locations} में भूमि सर्वेक्षण, मापी और वंशावली से जुड़ी किसी भी प्रकार की सहायता के लिए ${aminNameHi} से संपर्क करें।`;
  
  // IMPORTANT: Do NOT use aadhaarUrl or certificateUrl as the public OpenGraph image!
  // If you add a "profileImageUrl" later, use that. Otherwise use a default banner.
  const ogImage = dbProfile.profileImageUrl || "https://biharsurveysahayak.online/default-share-banner.jpg";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      siteName: 'Bihar Survey Sahayak',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${aminNameEn} - Digital Amin Profile`,
        },
      ],
      locale: 'hi_IN',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImage],
    },
  };
}

export default async function AminMobileApp(props) {
  await dbConnect();

  const params = await props.params; 
  const searchParams = await props.searchParams; 
  const paramIdentifier = params.id; 
  
  const isPreview = searchParams.preview === 'true';

  // ==========================================
  // STEP 1: FETCH FROM DATABASE FIRST
  // ==========================================
  let dbProfile = null;
  let baseUser = null;

  try {
    if (mongoose.Types.ObjectId.isValid(paramIdentifier) && paramIdentifier.length === 24) {
      dbProfile = await AminProfile.findOne({ userId: paramIdentifier }).lean();
    }
    if (!dbProfile) {
      dbProfile = await AminProfile.findOne({ slug: paramIdentifier }).lean();
    }
    if (dbProfile) {
      baseUser = await User.findById(dbProfile.userId).lean();
    }
  } catch (error) {
    console.log("Database query error:", error);
  }

  // ==========================================
  // STEP 2: HANDLE NOT FOUND (ABORT IF NULL)
  // ==========================================
  if (!dbProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-5 p-6 text-center">
         <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-2">
            <ShieldCheck size={36} className="text-slate-400" />
         </div>
         <h1 className="text-2xl font-bold text-slate-800">Profile Not Found</h1>
         <p className="text-slate-500 font-medium max-w-sm mb-4">
           The profile you are looking for does not exist or has been removed.
         </p>
         <Link 
            href="/" 
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md active:scale-95"
         >
            <Home size={20} />
            Go to Home
         </Link>
      </div>
    );
  }

  // ==========================================
  // STEP 3: SECURITY & COOKIE CHECKS 
  // ==========================================
  const cookieStore = await cookies();
  
  // Check for the 2-minute magic cookie
  const hasMagicCookie = cookieStore.has(`preview_auth_${dbProfile.slug}`);
  
  // Get logged-in user 
  const loggedInUserId = cookieStore.get("userId")?.value; 

  // It is a valid preview if they have the URL param AND (the magic cookie OR they are logged in as the owner)
  const isValidPreview = isPreview && (hasMagicCookie || (loggedInUserId === dbProfile.userId.toString()));

  // ==========================================
  // STEP 4: STATUS BLOCK (Live check)
  // ==========================================
  // Check if status is "live"
  const isLive = dbProfile.status === "live";
  const hasPaid = dbProfile.hasPaid === true;

  // Profile is publicly accessible ONLY if it is both Live AND Paid
  const isPubliclyAccessible = isLive && hasPaid;

  if (!isPubliclyAccessible && !isValidPreview) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
           <Lock size={32} />
        </div>
        <h1 className="text-2xl font-black mb-2 text-slate-800">Profile Inactive</h1>
        <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-6">
          यह डिजिटल प्रोफाइल अभी सक्रिय नहीं है। अमीन द्वारा इसे पब्लिश करने के बाद ही यह ग्राहकों के लिए उपलब्ध होगा।
        </p>
        <Link 
            href="/" 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md active:scale-95"
         >
            <Home size={20} />
            Back to Home
         </Link>
      </div>
    );
  }

  // ==========================================
  // STEP 5: CONDITIONAL REGISTRATION LOGIC
  // ==========================================
  const hasFormal = dbProfile.hasFormalCertificate === false;
  const regOrCertText = dbProfile.registrationNumber || dbProfile.certificateNumber || "N/A";
  
  const displayBadgeText = hasFormal ? "Experienced" : regOrCertText;
  const displayBadgeLabel = hasFormal ? "Status" : "Registration No.";

  // 6. Map database boolean services to the UI array
  const activeServices = [];
  if (dbProfile.services?.landMeasure) {
    activeServices.push({ name: "जमीन मापी", desc: "Land Measure", icon: <Map className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" });
  }
  if (dbProfile.services?.demarcation) {
    activeServices.push({ name: "सीमांकन", desc: "Demarcation", icon: <Compass className="w-6 h-6" />, color: "bg-emerald-50 text-emerald-600" });
  }
  if (dbProfile.services?.partition) {
    activeServices.push({ name: "बटवारा", desc: "Partition", icon: <Scale className="w-6 h-6" />, color: "bg-purple-50 text-purple-600" });
  }
  if (dbProfile.services?.surveyHelp) {
    activeServices.push({ name: "सर्वे सहायता", desc: "Bihar Survey", icon: <FileSignature className="w-6 h-6" />, color: "bg-orange-50 text-orange-600" });
  }
  
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  // 7. Format the data for the UI
  const amin = {
    ownerName: dbProfile.ownerNameEn || baseUser?.ownerName || "Amin",
    ownerNameHi: dbProfile.ownerNameHi || baseUser?.ownerName || "अमीन",
    mobileNumber: dbProfile.publicMobile || baseUser?.mobileNumber || "",
    whatsappNumber: dbProfile.whatsappNumber || dbProfile.publicMobile || baseUser?.mobileNumber || "",
    email: dbProfile.publicEmail || baseUser?.email || "",
    
    // Fallback to base user data for location if needed
    location: `${baseUser?.district || "Bihar"}`,
    address: dbProfile.publicAddress || baseUser?.address || "Address not provided",
    
    workingHours: dbProfile.workingHours || "सोमवार - शनिवार: 9:00 AM - 6:00 PM",
    serviceAreas: dbProfile.serviceAreas?.length > 0 ? dbProfile.serviceAreas : ["Local Area"],

    experience: dbProfile.experience ? `${dbProfile.experience}` : "NA",
    
    about: dbProfile.about || "मैं पिछले कई वर्षों से बिहार सर्वे, जमीन मापी, सीमांकन एवं ऑनलाइन सर्वे सहायता कार्य कर रहा हूँ।",
    services: activeServices,
    
    // Social Links
    facebookUrl: formatUrl(dbProfile.facebookUrl),
    instagramUrl: formatUrl(dbProfile.instagramUrl),
    youtubeUrl: formatUrl(dbProfile.youtubeUrl)
  };

  // Generate dynamic location for the schema
  const primaryLocation = dbProfile.serviceAreas && dbProfile.serviceAreas.length > 0 
    ? dbProfile.serviceAreas[0] 
    : "Bihar";

  // Create the structured data for Google Local Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": dbProfile.ownerNameEn,
    "alternateName": dbProfile.ownerNameHi,
    "image": dbProfile.profileImageUrl || "https://biharsurveysahayak.online/default-avatar.png",
    "@id": `https://biharsurveysahayak.online/amin/${dbProfile.slug}`,
    "url": `https://biharsurveysahayak.online/amin/${dbProfile.slug}`,
    "telephone": `+91${dbProfile.publicMobile}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": dbProfile.publicAddress,
      "addressLocality": primaryLocation,
      "addressRegion": "Bihar",
      "addressCountry": "IN"
    },
    "description": dbProfile.about || "Professional Amin providing land survey assistance.",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        "opens": dbProfile.startTime || "09:00",
        "closes": dbProfile.endTime || "18:00"
      }
    ]
  };

  return (
    // Replaced plain bg-slate-100 with a clean off-white base and added overflow-x-hidden
    <div className="bg-[#f8faf9] min-h-screen relative selection:bg-emerald-200 pb-36 font-sans overflow-x-hidden">
      
      {/* ================= DYNAMIC AMIN BACKGROUND ================= */}
      {/* 1. Base soft gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-emerald-50/60 via-[#f8faf9] to-amber-50/40 pointer-events-none" />

      {/* 2. Measurement Grid Pattern (Subliminal Surveying Feel) */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.35] pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', 
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, white 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, white 40%, transparent 100%)'
        }} 
      />

      {/* 3. Premium Glowing Ambient Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] rounded-full bg-emerald-400/15 blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed top-[30%] right-[-15%] w-[50vw] h-[50vw] min-w-[500px] min-h-[500px] rounded-full bg-amber-400/10 blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[10%] w-[45vw] h-[45vw] min-w-[450px] min-h-[450px] rounded-full bg-blue-400/10 blur-[120px] -z-10 pointer-events-none" />

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <CleanUrl />
        <ViewTracker slug={dbProfile.slug} />
        
        {/* ================= HEADER (Fixed at Top) ================= */}
        <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-black/70 via-black/30 to-transparent pt-5 md:pt-6">
          
          <ShareButton aminName={amin.ownerNameHi} />
          
          {/* --- PREMIUM STATUS PILLS --- */}
          {isValidPreview && !isLive && (
            <div className="flex items-center gap-2 bg-amber-950/60 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-1.5 rounded-full border border-amber-500/30 text-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.2)]">
              {/* Animated Amber Dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase pt-[1px]">Preview</span>
            </div>
          )}
          
          {isLive && (
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-1.5 rounded-full border border-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              {/* Animated Emerald Dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase pt-[1px] text-slate-100">Live</span>
            </div>
          )}

          {/* --- PREMIUM AVATAR COIN --- */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] md:text-lg uppercase bg-gradient-to-br from-emerald-400 to-emerald-700 border border-emerald-300/50 relative overflow-hidden group">
            {/* Inner glass shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 transform"></div>
            <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] tracking-wider">
              {amin.ownerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </span>
          </div>
          
        </header>

        {/* ================= TOP HERO COVER ================= */}
        <div className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden rounded-b-[40px] shadow-lg z-10 border-b border-emerald-500/20">
          <Image
            src="/images/bg-amin.png" 
            alt="Profile Cover"
            fill
            priority
            sizes="100vw"
            className="hidden md:block object-cover object-center"
          />

          <Image
            src="/images/bg-amin-mobile.png" 
            alt="Profile Cover"
            fill
            priority
            sizes="100vw"
            className="block md:hidden object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
         
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white max-w-3xl mx-auto w-full">
  
  {/* --- Background Watermark Text --- */}
  {/* Positioned absolutely so it sits behind the main text without breaking the layout */}
  <div className="absolute  left-2 -top-16 md:left-6 pointer-events-none select-none z-0">
    <div className={kalam.className}>
      <div className="mb-2 text-white/30 md:text-white/30 text-[8rem] md:text-[10rem] font-bold leading-none drop-shadow-sm">
        अमीन
      </div>
    </div>
  </div>
  
  {/* --- Foreground Content --- */}
  <div className="relative z-10">
    
    {/* --- PREMIUM STATUS BADGE --- */}
    <div className="inline-flex items-center gap-2 px-1.5 py-1.5 md:px-1.5 md:py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.4)] mb-4 md:mb-5 cursor-default pr-4 md:pr-5">
      {/* Glowing Icon Container */}
      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(52,211,153,0.5)] border border-emerald-300/50">
        <ShieldCheck size={16} className="text-white md:w-4 md:h-4" /> 
      </div>
      {/* Official Uppercase Text */}
      <span className="text-slate-100 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] pt-[1px]">
        {displayBadgeText}
      </span>
    </div>
    
    {/* --- PREMIUM HINDI NAME --- */}
    <h1 
      className="text-[2.5rem] md:text-[4rem] font-black leading-tight mb-1 md:mb-1 text-white tracking-tight"
      style={{
        textShadow: `
          0 1px 1px rgba(0,0,0,0.8),
          0 2px 4px rgba(0,0,0,0.6),
          0 4px 8px rgba(0,0,0,0.4),
          0 8px 16px rgba(0,0,0,0.3)
        `
      }}
    >
      {amin.ownerNameHi}
    </h1>
    
    {/* --- PREMIUM ENGLISH NAME --- */}
    <div className="flex items-center gap-3 mb-4 md:mb-5">
      <p 
        className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 font-bold text-xs md:text-sm tracking-[0.25em] uppercase" 
        style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))' }}
      >
        {amin.ownerName}
      </p>
      {/* Premium accent line fading out */}
      <div className="h-[1.5px] w-12 md:w-24 bg-gradient-to-r from-amber-400/80 to-transparent rounded-full"></div>
    </div>
    
    {/* --- PREMIUM LOCATION TAG --- */}
    <div className="flex items-center gap-2 text-white/95 text-xs md:text-sm font-medium tracking-wide capitalize bg-gradient-to-r from-black/50 to-black/20 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
      <div className="bg-amber-400/20 p-1 rounded-full">
        <MapPin size={14} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] md:w-4 md:h-4" /> 
      </div>
      <span className="drop-shadow-md">{amin.location}</span>
    </div>
    
  </div>
</div>
        </div>

        {/* ================= MAIN SCROLLABLE CONTENT ================= */}
        {/* Added flex-grow so the footer gets pushed down naturally */}
        {/* ================= MAIN SCROLLABLE CONTENT ================= */}
        <main className="relative max-full mx-auto w-full z-20 mt-2 flex-grow">
          {/* Inject JSON-LD into the DOM */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* --- QUICK STATS ROW --- */}
          <div className="flex gap-3 px-4 md:px-6 -mt-6 md:-mt-8 mb-6 md:mb-8 max-w-3xl mx-auto">
            {/* Colorful Experience Card */}
            <div className="flex-1 bg-gradient-to-br from-amber-50/95 to-orange-100/90 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-sm border border-amber-200/60 backdrop-blur-xl flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300">
              <Star size={20} className="text-amber-500 mb-1 fill-amber-500/30 md:w-7 md:h-7" />
              <p className="text-xl md:text-3xl font-black text-amber-950">{amin.experience}</p>
              <p className="text-[10px] md:text-xs uppercase font-bold text-amber-700/80 tracking-wide">Years Exp</p>
            </div>
            {/* Dark/Colorful Status Card */}
            <div className="flex-[2] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-md border border-emerald-500/40 flex flex-col justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-bl from-emerald-400/30 to-transparent rounded-full blur-2xl group-hover:from-emerald-400/50 transition-colors duration-500" />
              <p className="text-[11px] md:text-sm uppercase font-bold text-emerald-400 mb-0.5">{displayBadgeLabel}</p>
              <p className="text-lg md:text-3xl font-black text-white leading-none tracking-wide">{displayBadgeText}</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* --- ABOUT --- */}
            <div className="px-4 md:px-6 mb-6 md:mb-10">
              <h2 className="text-base md:text-lg font-black text-slate-800 mb-2 md:mb-4 px-1 flex items-center gap-2">
                <Briefcase size={18} className="text-emerald-500 md:w-5 md:h-5" /> परिचय (About)
              </h2>
              {/* Colorful About Card */}
              <div className="bg-gradient-to-r from-emerald-50/95 to-teal-50/80 backdrop-blur-xl rounded-2xl p-5 md:p-6 shadow-sm border border-emerald-100/80 border-l-4 border-l-emerald-500 relative overflow-hidden hover:shadow-md transition-all duration-300">
                <p className="leading-relaxed text-slate-800 text-sm md:text-[16px] font-medium">
                  {amin.about}
                </p>
              </div>
            </div>

            {/* --- SERVICES --- */}
            {activeServices.length > 0 && (
              <div className="mb-6 md:mb-10">
                <h2 className="text-base md:text-lg font-black text-slate-800 mb-2 md:mb-4 px-5 flex items-center gap-2">
                  <Map size={18} className="text-emerald-500 md:w-5 md:h-5" /> हमारी सेवाएँ (Services)
                </h2>
                
                <div className="grid grid-cols-2 gap-3 px-4 md:px-6 pb-2 pt-1">
                  {amin.services.map((service, idx) => (
                    <div 
                      key={idx} 
                      // Subtle colorful background gradient for service cards
                      className="group bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-xl rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200/60 hover:border-emerald-300 flex flex-col justify-between active:scale-[0.98] hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[120px] md:min-h-[140px] relative overflow-hidden"
                    >
                      <div className="absolute -right-6 -top-6 w-20 h-20 bg-slate-100 rounded-full blur-2xl group-hover:bg-emerald-100/60 transition-colors duration-500" />
                      
                      <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${service.color} shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                          {service.icon}
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="text-[14px] md:text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- DETAILED CONTACT & INFO SECTION (COMPACT) --- */}
            <div className="px-4 md:px-6 mb-8 md:mb-10">
              <h2 className="text-base md:text-lg font-black text-slate-800 mb-2 md:mb-4 px-1 flex items-center gap-2">
                <Building2 size={18} className="text-blue-500 md:w-5 md:h-5" /> संपर्क विवरण (Contact Info)
              </h2>
              
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-sm overflow-hidden relative">
                {/* Colorful top border indicator */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
                  
                  {/* Compact Grid Items */}
                  <div className="p-3 md:p-4 flex items-center gap-3 hover:bg-blue-50/50 transition-colors border-b md:border-r border-slate-100/80">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100/50">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Mobile Number</p>
                      <a href={`tel:${amin.mobileNumber}`} className="text-[13px] md:text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors">
                        +91 {amin.mobileNumber}
                      </a>
                    </div>
                  </div>

                  {amin.email && (
                    <div className="p-3 md:p-4 flex items-center gap-3 hover:bg-blue-50/50 transition-colors border-b border-slate-100/80">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                        <a href={`mailto:${amin.email}`} className="text-[13px] md:text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors truncate max-w-[180px] block">
                          {amin.email}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="p-3 md:p-4 flex items-center gap-3 hover:bg-blue-50/50 transition-colors border-b md:border-b-0 md:border-r border-slate-100/80">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm border border-amber-100/50">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Working Hours</p>
                      <p className="text-[13px] md:text-sm font-bold text-slate-800">{amin.workingHours}</p>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 flex items-center gap-3 hover:bg-blue-50/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-sm border border-purple-100/50">
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Office Address</p>
                      <p className="text-[13px] md:text-sm font-bold text-slate-800 line-clamp-1 capitalize" title={amin.address}>
                        {amin.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compact Service Areas */}
                <div className="bg-slate-50/80 p-3 md:p-4 border-t border-slate-100/80 relative z-10 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                    <MapPin size={12} /> Service Areas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {amin.serviceAreas.map((area, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[11px] md:text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm capitalize">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compact Social Media Links */}
                {(amin.facebookUrl || amin.instagramUrl || amin.youtubeUrl) && (
                  <div className="bg-gradient-to-r from-blue-50/30 to-indigo-50/30 p-3 border-t border-slate-100/80 relative z-10 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Connect Socially
                    </p>
                    <div className="flex items-center gap-3 pr-1">
                      {amin.facebookUrl && (
                        <a href={amin.facebookUrl} target="_blank" rel="noreferrer" className="hover:-translate-y-0.5 transition-transform">
                          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="w-6 h-6 object-contain" />
                        </a>
                      )}
                      {amin.instagramUrl && (
                        <a href={amin.instagramUrl} target="_blank" rel="noreferrer" className="hover:-translate-y-0.5 transition-transform">
                          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" className="w-6 h-6 object-contain" />
                        </a>
                      )}
                      {amin.youtubeUrl && (
                        <a href={amin.youtubeUrl} target="_blank" rel="noreferrer" className="hover:-translate-y-0.5 transition-transform">
                          <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" className="w-6 h-6 object-contain" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- DISCLAIMER --- */}
            <div className="px-4 md:px-8 text-center mb-10">
              <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed bg-white/40 inline-block px-4 py-2 rounded-xl backdrop-blur-sm">
                "यह प्रोफाइल जानकारी संबंधित अमीन द्वारा प्रदान की गई है।
                <a href="/" className="text-emerald-600 font-bold hover:underline ml-1">Bihar Survey Sahayak</a> एक डिजिटल प्लेटफॉर्म है।"
              </p>
              
              <div className="mt-4 flex items-start text-left md:items-center md:text-center justify-center gap-3  p-3 md:p-4  mx-auto">
                <div className="bg-amber-100 p-1.5 rounded-full shrink-0">
                  <ShieldCheck size={16} className="text-amber-600" />
                </div>
                <p className="text-[11px] md:text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="font-bold text-amber-600 mr-1">सुरक्षा टिप:</span> 
                  यह प्लेटफॉर्म आपको सीधे अमीन से जोड़ने का माध्यम है। लेन-देन और कार्य की जिम्मेदारी प्लेटफॉर्म की नहीं है।
                </p>
              </div>
            </div>
            
            <div className="h-10"/>
          </div>
        </main>

        {/* ================= FLOATING BOTTOM ACTION BAR ================= */}
        <div className="fixed bottom-1 md:bottom-4 left-0 right-0 z-[100] pointer-events-none pb-safe pt-4 flex justify-center">
          <div className="w-full max-w-3xl px-4 md:px-6 pointer-events-auto drop-shadow-2xl">
            <ContactButtons
              mobileNumber={amin.mobileNumber}
              whatsappNumber={amin.whatsappNumber}
              slug={dbProfile.slug}
            />
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <footer className="bg-slate-950 text-slate-300 relative z-20 mt-auto border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
            <div>
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain hidden" /> {/* Unhide if you have a logo */}
                Bihar Survey Sahayak
              </h4>
              <p className="text-sm leading-relaxed text-slate-400">
                A private citizen assistance platform designed to help users prepare documents and find verified Amins for the Bihar Land Survey 2026.
              </p>
              <p className="mt-4 font-bold"><Link href="/" className="text-emerald-400 hover:text-emerald-300 transition">Return to Home</Link></p>
            </div>
          
            <div>
              <h4 className="font-semibold text-white mb-4">Important Notice</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span> Not a Government Website</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span> No data stored on servers</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span> Works entirely on your device</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Verify details at official camps</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal & Support</h4>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li><Link href="/about" className="text-slate-400 hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition">Contact</Link></li>
                <li><Link href="/privacy-policy" className="text-slate-400 hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms-and-conditions" className="text-slate-400 hover:text-white transition">Terms</Link></li>
                <li><Link href="/disclaimer" className="text-slate-400 hover:text-white transition">Disclaimer</Link></li>
                <li><Link href="/faq" className="text-slate-400 hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/60 bg-slate-950 text-center text-xs text-slate-500 py-6">
            © {new Date().getFullYear()} Bihar Survey Sahayak — Private Technical Tool <br className="md:hidden" />
            <span className="block sm:inline mt-2 md:mt-0 md:ml-2">
              Designed &amp; Maintained by{" "}
              <a href="mailto:viktechzweb@gmail.com" className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors" aria-label="Email VIKTECHZ">
                VIK-TECHZ
              </a>
            </span>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .pb-safe {
            padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 0.5rem);
          }
        }
      `}} />
      
    </div>
  );
}