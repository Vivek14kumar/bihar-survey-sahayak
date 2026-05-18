
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
  const paramIdentifier = params.id;

  const dbProfile = await getAminProfile(paramIdentifier);

  if (!dbProfile) {
    return {
      title: "Profile Not Found | Bihar Survey Sahayak",
      description: "अमीन का प्रोफाइल नहीं मिला।"
    };
  }

  const aminName = dbProfile.ownerNameHi || "अमीन";
  const title = `${aminName} - Profile | Bihar Survey Sahayak`; //डिजिटल विजिटिंग कार्ड
  const description = `भूमि सर्वेक्षण से जुड़ी किसी भी प्रकार की समस्या या सलाह के लिए ${aminName} (अमीन) से संपर्क करें।`;
  
  // अगर अमीन की प्रोफाइल फोटो नहीं है, तो एक डिफ़ॉल्ट बैनर इमेज का URL दें
  const ogImage = dbProfile.profileImage || "https://biharsurveysahayak.online/default-share-banner.jpg";

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
          alt: `${aminName} Profile Picture`,
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
  const hasFormal = dbProfile.hasFormalCertificate === true;
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

  return (
    <div className="bg-slate-100 min-h-screen relative selection:bg-emerald-200 pb-36 font-sans overflow-hidden">
      <CleanUrl />
      {/* ================= HEADER (Fixed at Top) ================= */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-transparent backdrop-blur-[2px] ">
        <ShareButton aminName={amin.ownerNameHi} />
        {isValidPreview && !isLive && (
          <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-amber-500/50 text-amber-300 shadow-sm">
            <span className="text-xs md:text-sm font-bold tracking-wider">PREVIEW</span>
          </div>
        )}
        {isLive && (
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 text-white shadow-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs md:text-sm font-bold tracking-wider">ONLINE</span>
          </div>
        )}
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full border border-black/20 flex items-center justify-center text-white font-bold shadow-sm md:text-lg uppercase">
          {amin.ownerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
      </header>

      {/* ================= TOP HERO COVER ================= */}
      <div className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden rounded-b-[40px] shadow-sm z-10">
        <Image
          src="/images/bg-amin.png" 
          alt="Profile Cover"
          fill
          priority
          size="100vw"
          className="hidden md:block object-cover object-center"
        />

        <Image
          src="/images/bg-amin-mobile.png" 
          alt="Profile Cover"
          fill
          priority
          size="100vw"
          className="block md:hidden object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white max-w-3xl mx-auto w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs md:text-sm font-bold mb-3 shadow-lg border border-emerald-400/30">
            <ShieldCheck size={16} className="md:w-5 md:h-5" /> {displayBadgeText} 
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-1 md:mb-2 text-white drop-shadow-md">
            {amin.ownerNameHi}
          </h1>
          <p className="text-emerald-400 font-bold text-lg md:text-2xl mb-2 md:mb-3 drop-shadow-sm capitalize">
            {amin.ownerName}
          </p>
          <p className="text-slate-200 text-sm md:text-base font-semibold flex items-center gap-1.5 drop-shadow-sm capitalize">
            <MapPin size={16} className="text-emerald-500 md:w-5 md:h-5" /> {amin.location}
          </p>
        </div>
      </div>

      {/* ================= MAIN SCROLLABLE CONTENT ================= */}
      <main className="relative max-full mx-auto w-full z-20 mt-2">
         
        {/* --- QUICK STATS ROW --- */}
        <div className="flex gap-3 px-6 -mt-6 md:-mt-8 mb-8 md:mb-10">
          <div className="flex-1 bg-white rounded-3xl p-4 md:p-6 shadow-[0_8px_20px_rgb(0,0,0,0.06)] border border-white/50 backdrop-blur-xl flex flex-col items-center justify-center text-center">
            <Star size={24} className="text-amber-400 mb-1 fill-amber-400/20 md:w-8 md:h-8" />
            <p className="text-xl md:text-3xl font-black text-slate-800">{amin.experience}</p>
            <p className="text-[10px] md:text-xs uppercase font-bold text-slate-500">Years Exp</p>
          </div>
          <div className="flex-[2] bg-slate-900 rounded-3xl p-4 md:p-6 shadow-[0_8px_20px_rgb(0,0,0,0.15)] border border-slate-400 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-emerald-500/20 rounded-full blur-2xl md:blur-3xl" />
            <p className="text-[12px] md:text-xl uppercase font-bold text-emerald-400 mb-1">{displayBadgeLabel}</p>
            <p className="text-xl md:text-4xl font-bold text-white leading-none tracking-wide">{displayBadgeText}</p>
          </div>
        </div>

        {/* --- ABOUT --- */}
        <div className="px-4 md:px-6 mb-8 md:mb-12">
          <h2 className="text-lg md:text-xl font-black text-slate-900 mb-3 md:mb-5 px-2 flex items-center gap-2">
            <Briefcase size={20} className="text-emerald-500 md:w-6 md:h-6" /> परिचय (About)
          </h2>
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-l-4 border-green-400 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
            <p className="leading-relaxed text-slate-600 text-sm md:text-[17px] font-medium pl-2 md:pl-4">
              {amin.about}
            </p>
          </div>
        </div>

        {/* --- SERVICES --- */}
        {activeServices.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h2 className="text-lg md:text-xl font-black text-slate-900 mb-3 md:mb-5 px-6 flex items-center gap-2">
                <Map size={20} className="text-emerald-500 md:w-6 md:h-6" /> हमारी सेवाएँ (Services)
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 px-4 md:px-6 pb-4 pt-1">
              {amin.services.map((service, idx) => (
                <div 
                  key={idx} 
                  className="group bg-white rounded-3xl p-5 md:p-8 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between active:scale-[0.98] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 min-h-[140px] md:min-h-[180px] relative overflow-hidden"
                >
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-slate-50 rounded-full blur-2xl group-hover:bg-emerald-50 transition-colors duration-500" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center ${service.color} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                      {service.icon}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-[15px] md:text-xl font-black text-slate-800 leading-tight mb-1.5 group-hover:text-emerald-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">
                      {service.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- DETAILED CONTACT & INFO SECTION --- */}
        <div className="px-4 md:px-6 mb-8 md:mb-12">
          <h2 className="text-lg md:text-xl font-black text-slate-900 mb-3 md:mb-5 px-2 flex items-center gap-2">
            <Building2 size={20} className="text-emerald-500 md:w-6 md:h-6" /> संपर्क विवरण (Contact Info)
          </h2>
          
          <div className="bg-white rounded-3xl border-l-4 border-yellow-400 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden relative">
            <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 bg-white/60 backdrop-blur-[2px]">
              
              <div className="p-5 md:p-8 flex items-center gap-4 hover:bg-slate-50/80 transition-colors border-b md:border-r border-slate-100">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                  <Phone size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile Number</p>
                  <a href={`tel:${amin.mobileNumber}`} className="text-sm md:text-[15px] font-bold text-slate-800 hover:text-emerald-600 transition-colors">
                    +91 {amin.mobileNumber}
                  </a>
                </div>
              </div>

              {amin.email && (
                <div className="p-5 md:p-8 flex items-center gap-4 hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                    <Mail size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                    <a href={`mailto:${amin.email}`} className="text-sm md:text-[15px] font-bold text-slate-800 hover:text-blue-600 transition-colors break-all">
                      {amin.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="p-5 md:p-8 flex items-center gap-4 hover:bg-slate-50/80 transition-colors border-b md:border-b-0 md:border-r border-slate-100">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-inner">
                  <Clock size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Working Hours</p>
                  <p className="text-sm md:text-[15px] font-bold text-slate-800">{amin.workingHours}</p>
                </div>
              </div>

              <div className="p-5 md:p-8 flex items-center gap-4 hover:bg-slate-50/80 transition-colors">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-inner">
                  <MapPin size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Office Address</p>
                  <p className="text-sm md:text-[15px] font-bold text-slate-800 line-clamp-2 capitalize" title={amin.address}>
                    {amin.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/90 backdrop-blur-sm p-5 md:p-8 border-t border-slate-100 relative z-10">
              <p className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 md:mb-4 flex items-center gap-2">
                <MapPin size={14} /> Service Areas (कार्य क्षेत्र)
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {amin.serviceAreas.map((area, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-xs md:text-sm font-bold px-4 py-2 rounded-xl shadow-sm hover:border-emerald-200 hover:text-emerald-700 transition-colors cursor-default capitalize">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* --- SOCIAL MEDIA LINKS --- */}
              {(amin.facebookUrl || amin.instagramUrl || amin.youtubeUrl) && (
                <div className="bg-white/70 backdrop-blur-md p-5 md:p-6 border-t border-slate-200 relative z-10">

                  {/* Heading */}
                  <div className="text-center mb-5">
                    {/*<h3 className="text-base md:text-lg font-bold text-slate-800">
                      सोशल मीडिया प्रोफाइल
                    </h3>*/}
                    <p className="text-xs text-slate-500 mt-1">
                      हमारे सोशल मीडिया प्लेटफॉर्म पर जुड़ें
                    </p>
                  </div>
              
                  {/* Icons */}
                  <div className="flex items-center justify-center gap-5 md:gap-7">
              
                    {/* Facebook */}
                    {amin.facebookUrl && (
                      <a
                        href={amin.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative"
                      >
                        <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                    
                        <div className="relative w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                            alt="Facebook"
                            className="w-7 h-7"
                          />
                        </div>
                      </a>
                    )}

                    {/* Instagram */}
                    {amin.instagramUrl && (
                      <a
                        href={amin.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative"
                      >
                        <div className="absolute inset-0 rounded-full bg-pink-500 blur-md opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                    
                        <div className="relative w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                            alt="Instagram"
                            className="w-7 h-7"
                          />
                        </div>
                      </a>
                    )}

                    {/* YouTube */}
                    {amin.youtubeUrl && (
                      <a
                        href={amin.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative"
                      >
                        <div className="absolute inset-0 rounded-full bg-red-500 blur-md opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                    
                        <div className="relative w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                            alt="YouTube"
                            className="w-7 h-7"
                          />
                        </div>
                      </a>
                    )}

                  </div>
                </div>
              )}

          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-slate-600 font-bold leading-relaxed">
            "यह प्रोफाइल जानकारी संबंधित अमीन द्वारा प्रदान की गई है।
            <a href="/" className="text-blue-500"> Bihar Survey Sahayak</a> एक डिजिटल प्रोफाइल एवं सर्वे सहायता प्लेटफॉर्म है।"
          </p>
        </div>
        <div className="h-20"/>
      </main>

      {/* ================= FLOATING BOTTOM ACTION BAR ================= */}
<div className="fixed bottom-1 md:bottom-4 left-0 right-0 z-[100] pointer-events-none pb-safe pt-4 flex justify-center">
  <div className="w-full max-w-3xl px-4 md:px-6 pointer-events-auto">
    
    <div className="bg-white/80 backdrop-blur-2xl border border-white/40 p-2 md:p-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.18)] flex gap-2 md:gap-4">

      {/* CALL BUTTON */}
      <a
        href={`tel:${amin.mobileNumber}`}
        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full py-3.5 md:py-4 flex items-center justify-center gap-2 font-bold text-sm md:text-base active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30"
      >
        <Phone size={18} className="md:w-5 md:h-5" />
        कॉल करें
      </a>

      {/* WHATSAPP BUTTON */}
      <a
        href={`https://wa.me/91${amin.whatsappNumber}?text=नमस्ते, मैंने Bihar Survey Sahayak पर आपकी प्रोफाइल देखी है।`}
        target="_blank"
        rel="noreferrer"
        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-600 hover:to-green-700 text-white rounded-full py-3.5 md:py-4 flex items-center justify-center gap-2 font-bold text-sm md:text-base active:scale-[0.98] transition-all shadow-lg shadow-green-500/30"
      >

        {/* Real WhatsApp Icon */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          alt="WhatsApp"
          className="w-5 h-5 md:w-6 md:h-6"
        />

        WhatsApp
      </a>

    </div>
  </div>
</div>
      <footer className="bg-slate-900 text-slate-300 ">
              <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
                <div>
                  <h4 className="font-semibold text-white mb-4">About Platform</h4>
                  <p className="text-sm leading-relaxed text-slate-400">
                    Bihar Survey Sahayak is a private citizen assistance platform
                    designed to help users prepare Vanshavali documents for Bihar
                    Land Survey 2026 in official-ready PDF format.
                  </p>
                  <p className="mt-4 font-bold"><Link href="/" className="hover:text-white transition">Home</Link></p>
                </div>
              
                <div>
                  <h4 className="font-semibold text-white mb-4">Important Notice</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>Not a Government Website</li>
                    <li>No data stored on servers</li>
                    <li>Works entirely on your device</li>
                    <li>Verify details at official survey camps</li>
                  </ul>
                </div>
      
                <div>
                  <h4 className="font-semibold text-white mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                    <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                    <li><Link href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link></li>
                    <li><Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link></li>
                    <li><Link href="/feedback" className="hover:text-white transition">Feedback</Link></li>
                    <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                    <li><Link href="/refund" className="hover:text-white transition">Refund</Link></li>
                  </ul>
                </div>
              </div>
      
              <div className="border-t border-slate-800 text-center text-xs text-slate-500 py-6">
                © {new Date().getFullYear()} Bihar Survey Sahayak — Private Technical Tool  <br></br>
                <span className="block sm:inline">
                  Designed &amp; Maintained by{" "}
                  <a href="mailto:viktechzweb@gmail.com" className="text-blue-500 hover:text-blue-600 font-semibold" aria-label="Email VIKTECHZ">
                    VIK-TECHZ
                  </a>
                </span>
              </div>
            </footer>

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