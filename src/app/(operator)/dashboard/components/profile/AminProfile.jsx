"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, User, Briefcase, Phone, Eye, XCircle,
  CreditCard, Lock, CheckCircle2, Clock, Globe, Loader2,
  UploadCloud, Facebook, Youtube, Instagram, Link as LinkIcon, FileText, AlertCircle, ExternalLink
} from "lucide-react";
import ServiceAreaInput from "./ServiceAreaInput";

export default function AminProfileForm({ existingData }) {
  // 1. Core States
  const [profileSlug, setProfileSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  const [subscriptionEndsAt, setSubscriptionEndsAt] = useState(null);
  
  // Custom status to track verification flow (draft, pending, live, expired)
  const [profileStatus, setProfileStatus] = useState("draft"); 
  const [rejectionReason, setRejectionReason] = useState("");

  // Document Toggle State
  const [hasFormalCertificate, setHasFormalCertificate] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  
  // NEW: State for Amins without certificates
  const [noFormalCert, setNoFormalCert] = useState(false);
  const [serviceInput, setServiceInput] = useState("");

  // New state to track if a selected file is too large
  const [fileErrors, setFileErrors] = useState({
    aadhaarUrl: null,
    certificateUrl: null,
    experienceLetterUrl: null
  });

  // New state to hold files before uploading
  const [selectedFiles, setSelectedFiles] = useState({
    aadhaarUrl: null,
    certificateUrl: null,
    experienceLetterUrl: null
  });

  const handleServiceKeyDown = (e) => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();

    const value = serviceInput.trim();
    if (!value) return;

    // Prevent duplicate tags
    if (!formData.serviceAreas.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, value],
      }));
    }

    setServiceInput("");
  }
};

const removeServiceArea = (index) => {
  setFormData((prev) => ({
    ...prev,
    serviceAreas: prev.serviceAreas.filter((_, i) => i !== index),
  }));
};

  const handleWalletPayment = async () => {
  if (!window.confirm("Deduct ₹199 from your wallet for a 30-day subscription?")) return;
  
  setIsSaving(true);
  try {
    const res = await fetch("/api/wallet/wallet-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: formData.userId }),
    });
    const data = await res.json();
    
    if (data.success) {
      alert("Payment Successful! Profile is live. (वॉलेट से भुगतान सफल)");
      window.location.reload();
    } else {
      alert(data.error || "Payment failed.");
    }
  } catch (error) {
    alert("Server error.");
  } finally {
    setIsSaving(false);
  }
};

  const [formData, setFormData] = useState({
    userId: existingData?._id || "",
    ownerNameEn: existingData?.ownerName || "", 
    ownerNameHi: "", 
    publicMobile: existingData?.mobileNumber || "",
    whatsappNumber: existingData?.mobileNumber || "",
    publicEmail: existingData?.email || "",
    publicAddress: existingData?.address || "",
    startDay: "सोमवार",
    endDay: "शनिवार",
    startTime: "09:00",
    endTime: "18:00",
    serviceAreas: [], 
    registrationNumber: "",
    certificateNumber: "",
    experience: "",
    about: "मैं पिछले कई वर्षों से बिहार सर्वे, जमीन मापी, सीमांकन एवं ऑनलाइन सर्वे सहायता कार्य कर रहा हूँ।",
    services: { landMeasure: true, demarcation: true, partition: false, surveyHelp: true },
    acceptedTerms: false,
    
    // Documents & Links
    aadhaarUrl: "",
    certificateUrl: "",
    experienceLetterUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // ==========================================
  // FETCH SAVED DATA ON COMPONENT MOUNT
  // ==========================================
  useEffect(() => {
    const fetchSavedProfile = async () => {
      if (!existingData?._id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/profile?userId=${existingData._id}`);
        const data = await response.json();

        if (data.success && data.profile) {
          const p = data.profile;
          
          setProfileSlug(p.slug || "");
          setSubscriptionEndsAt(p.subscriptionEndsAt ? new Date(p.subscriptionEndsAt) : null);
          
          // Determine status based on backend data
          if (p.status === "live" || (p.subscriptionEndsAt && new Date(p.subscriptionEndsAt) > new Date())) {
    setProfileStatus("live");
  } else if (p.status === "pending" || p.isUnderVerification) {
    setProfileStatus("pending");
  } else if (p.status === "rejected") {
    // NEW: Handle Rejected State
    setProfileStatus("rejected");
    setRejectionReason(p.rejectionReason); 
  } else if (p.subscriptionEndsAt && new Date(p.subscriptionEndsAt) < new Date()) {
    setProfileStatus("expired");
  } else {
    setProfileStatus("draft");
  }
          
          if (p.experienceLetterUrl && !p.certificateUrl) {
             setHasFormalCertificate(false);
          }

          setFormData({
            userId: existingData._id,
            ownerNameEn: p.ownerNameEn || existingData.ownerName || "",
            ownerNameHi: p.ownerNameHi || "",
            publicMobile: p.publicMobile || existingData.mobileNumber || "",
            whatsappNumber: p.whatsappNumber || existingData.mobileNumber || "",
            publicEmail: p.publicEmail || existingData.email || "",
            publicAddress: p.publicAddress || existingData.address || "",
            startDay: p.startDay || "सोमवार",
            endDay: p.endDay || "शनिवार",
            startTime: p.startTime || "09:00",
            endTime: p.endTime || "18:00",
            serviceAreas: p.serviceAreas?.join(', ') || "", 
            registrationNumber: p.registrationNumber || "",
            certificateNumber: p.certificateNumber || "",
            experience: p.experience || "",
            about: p.about || "मैं पिछले कई वर्षों से बिहार सर्वे, जमीन मापी, सीमांकन एवं ऑनलाइन सर्वे सहायता कार्य कर रहा हूँ।",
            services: p.services || { landMeasure: true, demarcation: true, partition: false, surveyHelp: true },
            acceptedTerms: p.acceptedTerms || false,
            
            aadhaarUrl: p.aadhaarUrl || "",
            certificateUrl: p.certificateUrl || "",
            experienceLetterUrl: p.experienceLetterUrl || "",
            facebookUrl: p.facebookUrl || "",
            youtubeUrl: p.youtubeUrl || "",
            instagramUrl: p.instagramUrl || "",
          });
          }

          

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchSavedProfile();
  }, [existingData]);

  // Auto switch logic
useEffect(() => {
  if (noFormalCert) {
    // If user has NO certificate → select experience mode
    setHasFormalCertificate(false);
  } else {
    // If checkbox unchecked → select certificate mode
    setHasFormalCertificate(true);
  }
}, [noFormalCert]);

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  // ==========================================
  // HELPERS
  // ==========================================
  const hasUploadedDocs = formData.aadhaarUrl && (formData.certificateUrl || formData.experienceLetterUrl);
  const isAadhaarUploaded = !!formData.aadhaarUrl;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "about" && value.length > 250) return; 
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleHindiTyping = async (e) => {
    const text = e.target.value;
    setFormData((prev) => ({ ...prev, ownerNameHi: text }));

    if (text.endsWith(' ')) {
      const words = text.split(' ');
      const lastWord = words[words.length - 2]; 

      if (lastWord && /^[a-zA-Z]+$/.test(lastWord)) {
        setIsTranslating(true);
        try {
          const res = await fetch(`https://inputtools.google.com/request?text=${lastWord}&itc=hi-t-i0-und&num=1`);
          const data = await res.json();
          if (data[0] === "SUCCESS") {
            const hindiWord = data[1][0][1][0]; 
            words[words.length - 2] = hindiWord;
            setFormData((prev) => ({ ...prev, ownerNameHi: words.join(' ') }));
          }
        } catch (err) {
          console.error("Translation error", err);
        } finally {
          setIsTranslating(false);
        }
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "acceptedTerms") {
      setFormData(prev => ({ ...prev, acceptedTerms: checked }));
      if (errors.acceptedTerms) setErrors((prev) => ({ ...prev, acceptedTerms: null }));
    } else {
      setFormData((prev) => ({
        ...prev,
        services: { ...prev.services, [name]: checked }
      }));
    }
  };

  const handleFileSelect = (e, docType) => {
  const file = e.target.files[0];
  if (!file) return;

  const MAX_SIZE = 800 * 1024 ; // 800 KB in bytes

  if (file.size > MAX_SIZE) {
    // Set error and reject the file
    setFileErrors(prev => ({ 
      ...prev, 
      [docType]: "फाइल बहुत बड़ी है। कृपया 800 KB से कम की फाइल चुनें। " 
    }));
    // Clear any previously selected file
    setSelectedFiles(prev => ({ ...prev, [docType]: null }));
    return;
  }

  // If file is good, clear any previous errors and save it to state
  setFileErrors(prev => ({ ...prev, [docType]: null }));
  setSelectedFiles(prev => ({ ...prev, [docType]: file }));
};

  const handleFileUpload = async (docType) => {
    const file = selectedFiles[docType];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return alert("File is too large! Please upload a file smaller than 5MB.");
    }

    setUploadingDoc(docType);
    
    try {
      const payloadForm = new FormData();
      payloadForm.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: payloadForm,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, [docType]: data.url }));
        setSelectedFiles(prev => ({ ...prev, [docType]: null })); 
        
        alert(`Document uploaded successfully! (दस्तावेज़ सफलतापूर्वक अपलोड हो गया)`);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Something went wrong during the upload. Please check your connection.");
    } finally {
      setUploadingDoc(null);
    }
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const validateForm = () => {
    let newErrors = {};
    const mobileRegex = /^[6-9]\d{9}$/;
    
    if (formData.publicMobile && !mobileRegex.test(formData.publicMobile)) {
      newErrors.publicMobile = "सही 10-अंकों का मोबाइल नंबर दर्ज करें।";
    }
    if (!formData.ownerNameEn?.trim()) {
      newErrors.ownerNameEn = "English Name (अंग्रेज़ी में नाम) भरना अनिवार्य है।";
    }
    if (!formData.ownerNameHi?.trim()) {
      newErrors.ownerNameHi = "Hindi Name (हिंदी में नाम) भरना अनिवार्य है।";
    }
    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = "नियम एवं शर्तें (Terms & Conditions) स्वीकार करना अनिवार्य है।";
    }

    setErrors(newErrors);
    
    // ध्यान दें: अब हम true/false की जगह सीधा newErrors का object वापस भेज रहे हैं
    return newErrors; 
};

  const handleSubmit = async (action) => {
   // पहले फॉर्म चेक करें और सारे एरर्स निकालें
    const validationErrors = validateForm();
    
    // अगर कोई भी एरर है (यानी बॉक्स खाली है)
    if (Object.keys(validationErrors).length > 0) {
        // सारे एरर मैसेज की एक लिस्ट बनाएं
        const errorMessages = Object.values(validationErrors).join('\n ');
        
        // लिस्ट को अलर्ट में दिखाएं
        return alert("कृपया फॉर्म सेव करने से पहले निम्नलिखित जानकारी भरें:\n\n " + errorMessages);
    }
    setIsSaving(true);
    
    const processedServiceAreas = Array.isArray(formData.serviceAreas)
      ? formData.serviceAreas.filter(Boolean) // अगर पहले से Array है (नए कॉम्पोनेंट से)
      : formData.serviceAreas.split(',').map(s => s.trim()).filter(Boolean); // अगर पुराना String फॉर्मेट है
    
      const payload = {
      ...formData,
      workingHours: `${formData.startDay} - ${formData.endDay}: ${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`,
      serviceAreas: processedServiceAreas,
      actionType: action,
    };

    try {
      const res = await fetch('/api/profile/update', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      });
      
      const result = await res.json();

      if (result.success) {
        setProfileSlug(result.slug); 

        if (action === "preview") {
          document.cookie = `preview_auth_${result.slug}=true; max-age=120; path=/`;
          window.open(`/amin/${result.slug}?preview=true`, "_blank");
        } else if (action === "submitVerification") {
          setProfileStatus("pending");
          alert("Your profile has been submitted for verification. Admin will check it soon! (आपकी प्रोफ़ाइल सत्यापन के लिए सबमिट कर दी गई है!)");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (action === "pay") {
  const isScriptLoaded = await loadRazorpayScript();
  if (!isScriptLoaded) return alert("Failed to load Razorpay. Check your internet connection.");

  try {
    // 1. Create the Order
    const orderRes = await fetch("/api/razorpay/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: formData.userId }),
    });
    const orderData = await orderRes.json();

    if (orderData.error) return alert("Error creating order: " + orderData.error);

    // 2. Open Razorpay Popup
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use your public key
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Bihar Survey Sahayak",
      description: "Amin Profile Subscription (30 Days)",
      order_id: orderData.id,
      handler: async function (response) {
        // 3. Verify Payment on Backend
        setIsSaving(true);
        const verifyRes = await fetch("/api/razorpay/verify-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: formData.userId,
          }),
        });

        const verifyResult = await verifyRes.json();
        setIsSaving(false);

        if (verifyResult.success) {
          alert("Payment Successful! Your profile is live for 30 days. (भुगतान सफल, आपकी प्रोफ़ाइल लाइव है)");
          window.location.reload(); // Reload to refresh dates and status
        } else {
          alert("Payment verification failed.");
        }
      },
      prefill: {
        name: formData.ownerNameEn,
        email: formData.publicEmail,
        contact: formData.publicMobile,
      },
      theme: { color: "#1056b9" }, // Emerald color to match your UI
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();

  } catch (error) {
    alert("Payment gateway error.");
    console.error(error);
  }

        } else {
          alert("Profile Updated Successfully!");
        }
      } else {
        alert("Server Error: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Loading Profile Data...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      
      {/* ========================================== */}
      {/* DYNAMIC STATUS BANNERS (TOP) */}
      {/* ========================================== */}
      
      {profileStatus === "draft" && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-6 mb-6 text-white shadow-lg border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-white">
              <Eye size={20} className="text-blue-400" /> Draft Mode (ड्राफ्ट मोड)
            </h3>
            <p className="text-slate-300 text-sm md:text-base">
              Your profile is currently hidden. <b>Please complete the form, upload your KYC documents at the bottom, and submit for verification.</b>
            </p>
          </div>
        </div>
      )}

      {profileStatus === "pending" && (
        <div className="bg-orange-500 rounded-3xl p-6 mb-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Clock size={20} /> Under Verification (सत्यापन प्रक्रिया में)
            </h3>
            <p className="text-amber-50 text-sm md:text-base">
              Your documents have been submitted. <b>Our admin is reviewing your profile.</b> Once approved, your 3-Day Free Trial will begin automatically and your link will be live.
            </p>
          </div>
        </div>
      )}

      {profileStatus === "live" && (
        <div className="bg-emerald-500 rounded-3xl p-6 mb-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <CheckCircle2 size={20} /> Profile is Live & Verified (प्रोफाइल लाइव है)
            </h3>
            <p className="text-emerald-50 text-sm flex items-center gap-2 break-all">
              <Globe size={16} />
              <a
                href={`https://biharsurveysahayak.online/amin/${profileSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white underline underline-offset-4 transition-colors"
              >
                biharsurveysahayak.online/amin/{profileSlug}
              </a>
            </p>
            <p className="text-xs text-emerald-100 mt-2 font-medium ">
                Access valid until: {subscriptionEndsAt?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button onClick={() => window.open(`/amin/${profileSlug}`, "_blank")} className="whitespace-nowrap px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl shadow-md hover:scale-105 transition-transform flex items-center gap-2">
            <Eye size={18} /> View Live Profile
          </button>
        </div>
      )}

      {profileStatus === "rejected" && (
        <div className="bg-red-400 rounded-3xl p-6 mb-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
              <XCircle size={24} className="text-red-200" /> Verification Rejected (सत्यापन अस्वीकृत)
            </h3>
            
            {/* Admin Reason Box */}
            <div className="bg-white/10 p-4 rounded-xl border border-red-400/50 backdrop-blur-sm my-3">
              <p className="text-xs text-black font-bold uppercase tracking-wider mb-1">Admin Message:</p>
              <p className="text-white font-medium ">
                {rejectionReason || "Please check your uploaded documents and details."}
              </p>
            </div>
            
            <p className="text-red-100 text-sm">
              Please fix the issue mentioned above. You can upload new documents below if required, then click <b>"Submit for Verification"</b> again to send it back to the admin. 
              <br/>(कृपया उपरोक्त समस्या को ठीक करें और पुनः सबमिट करें।)
            </p>
          </div>
        </div>
      )}

      {profileStatus === "expired" && (
        <div className="bg-red-400 rounded-3xl p-6 mb-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
           <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Lock size={20} /> Profile Suspended (प्रोफाइल निलंबित)
            </h3>
            <p className="text-red-50 text-sm md:text-base">
              Your trial or subscription has ended. Please pay your ₹199 monthly fee to reactivate your profile to the public.
            </p>
          </div>
        </div>
      )}

      {/* State: Expired (Must Pay to Reactivate) */}
        {profileStatus === "expired" && (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">

            {/* Option 1: Pay via Wallet */}
            <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
              <button 
                type="button" 
                disabled={isSaving || (existingData?.walletBalance || 0) < 199} 
                onClick={handleWalletPayment} 
                className={`w-full px-6 py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                  (existingData?.walletBalance || 0) >= 199 
                    ? "bg-slate-800 hover:bg-slate-900 text-white" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <CreditCard size={20} /> Pay via Wallet
              </button>
              <span className={`text-xs font-bold ${(existingData?.walletBalance || 0) >= 199 ? "text-emerald-600" : "text-red-500"}`}>
                Wallet Balance: ₹{existingData?.walletBalance || 0}
              </span>
            </div>
              
            <span className="text-slate-400 font-bold text-sm hidden sm:block">OR</span>
              
            {/* Option 2: Pay via Razorpay */}
            <button 
              type="button" 
              disabled={isSaving} 
              onClick={() => handleSubmit("pay")} // Your existing Razorpay function
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 h-max"
            >
              <ExternalLink size={20} /> Pay ₹199 via UPI/Card
            </button>
          </div>
        )}

      {/* FORM SECTION */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-6 text-slate-800">
          <h2 className="text-xl md:text-2xl font-bold">Setup Digital Profile</h2>
          <p className="text-slate-500 text-sm">Fill out the details below to generate your visiting card.</p>
        </div>

        <div className="p-6 md:p-8 space-y-10">
          
          {/* Personal Branding */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2 mb-4">
              <User size={20} className="text-emerald-500" /> Personal Branding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Name in English *</label>
                <input type="text" name="ownerNameEn" value={formData.ownerNameEn} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.ownerNameEn ? 'border-red-500' : 'bg-slate-50 border-slate-200'} focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none`} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2 flex justify-between">
                  <span>Name in Hindi (नाम) *</span>
                  {isTranslating && <span className="text-xs text-emerald-500 animate-pulse">Translating...</span>}
                </label>
                <input type="text" name="ownerNameHi" value={formData.ownerNameHi} onChange={handleHindiTyping} placeholder="Type in English & press Space..." className={`w-full px-4 py-3 rounded-xl border ${errors.ownerNameHi ? 'border-red-500' : 'bg-slate-50 border-slate-200'} focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none`} />
                <p className="text-[11px] text-slate-400 mt-1.5 font-medium">✨ Auto-converts to Hindi on space</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2 mb-4">
              <Phone size={20} className="text-blue-500" /> Public Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Calling Number</label>
                <input type="tel" name="publicMobile" value={formData.publicMobile} onChange={handleChange} maxLength="10" className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">WhatsApp Number</label>
                <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} maxLength="10" className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Business Email</label>
                <input type="email" name="publicEmail" value={formData.publicEmail} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>
            </div>
            <div className="mt-2">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Address</label>
                <input type="text" name="publicAddress" value={formData.publicAddress} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>
          </div>

          {/* Professional Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2 mb-4">
              <Briefcase size={20} className="text-emerald-500" /> Professional Details
            </h3>
            
            {/* NO CERTIFICATE CHECKBOX & DISCLAIMER */}
            <div className="mb-6">
              <label className="inline-flex items-center gap-2 cursor-pointer p-3 bg-yellow-50 rounded-xl">
                <input 
                  type="checkbox" 
                  checked={noFormalCert} 
                  onChange={(e) => setNoFormalCert(e.target.checked)} 
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                />
                <span className="text-sm font-semibold text-red-700">I don't have a Formal Registration / Certificate Number (मेरे पास पंजीकरण/प्रमाण पत्र नहीं है)</span>
              </label>
              
              {noFormalCert && (
                <div className="mt-3 p-4 bg-yellow-50  rounded-xl text-xs text-red-800 font-semibold leading-relaxed">
                   DISCLAIMER: By selecting this, you declare that you perform Amin services based on a Mukhiya Letter or Self-Affidavit. You take full personal and legal responsibility for any disputes, mapping errors, or issues arising with clients. Bihar Survey Sahayak is not liable for your work. <br/>
                  (चेतावनी: इसे चुनकर आप घोषणा करते हैं कि आप मुखिया पत्र या शपथ पत्र के आधार पर कार्य करते हैं। किसी भी विवाद, मापी में त्रुटि या कानूनी समस्या के लिए आप स्वयं जिम्मेदार होंगे।)
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Registration No.</label>
                <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="e.g. GM/12A00000" disabled={noFormalCert} className={`w-full px-4 py-3 rounded-xl border ${noFormalCert ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500'} outline-none`}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Certificate No.</label>
                <input type="text" name="certificateNumber" value={formData.certificateNumber} onChange={handleChange} placeholder="" disabled={noFormalCert} className={`w-full px-4 py-3 rounded-xl border ${noFormalCert ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500'} outline-none`}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Experience (Years)</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"/>
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-600 mb-2 flex justify-between">
                <span>About You / Bio (परिचय)</span>
                <span className={`text-xs ${formData.about.length >= 250 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                  {formData.about.length} / 250
                </span>
              </label>
              <textarea name="about" rows={3} value={formData.about} onChange={handleChange} maxLength={250} className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2 mb-4">
              <LinkIcon size={20} className="text-blue-500" /> Social Media & Marketing
            </h3>
            <p className="text-xs text-slate-500 mb-4">Add your links to build trust. Leave blank if you don't use them.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2"><Facebook size={16} className="text-blue-600"/> Facebook Profile</label>
                <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2"><Youtube size={16} className="text-red-600"/> YouTube Channel</label>
                <input type="url" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 focus:ring-2 focus:ring-red-500 outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2"><Instagram size={16} className="text-pink-600"/> Instagram Profile</label>
                <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 focus:ring-2 focus:ring-pink-500 outline-none"/>
              </div>
            </div>
          </div>

          {/* Operations & Services */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2 mb-4">
              <Clock size={20} className="text-emerald-500" /> Operations & Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-sm font-semibold text-slate-600 mb-3">Working Days & Hours</label>
                <div className="flex items-center gap-2 mb-3">
                  <select name="startDay" value={formData.startDay} onChange={handleChange} className="flex-1 p-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    {["सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार", "रविवार"].map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                  <span className="text-slate-400 text-sm">to</span>
                  <select name="endDay" value={formData.endDay} onChange={handleChange} className="flex-1 p-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    {["सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार", "रविवार"].map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="flex-1 p-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"/>
                  <span className="text-slate-400 text-sm">to</span>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="flex-1 p-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"/>
                </div>
              </div>
              <ServiceAreaInput 
   formData={formData} 
   setFormData={setFormData} 
/>
              <p>Note:- अगर एक से अधिक (Area) लिखना है तो (Area) का नाम लिखने के बाद  <span>,</span></p>
            </div>
            
            <label className="block text-sm font-semibold text-slate-600 mb-3">Select Services Provided</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['landMeasure', 'demarcation', 'partition', 'surveyHelp'].map((serviceKey) => {
                const labels = { landMeasure: 'जमीन मापी', demarcation: 'सीमांकन', partition: 'बटवारा', surveyHelp: 'सर्वे सहायता' };
                return (
                  <label key={serviceKey} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition">
                    <input type="checkbox" name={serviceKey} checked={formData.services[serviceKey]} onChange={handleCheckboxChange} className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500" />
                    <span className="text-sm font-semibold text-slate-700">{labels[serviceKey]}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Legal Agreement with Permanent Block Warning */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-1">
                <input type="checkbox" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleCheckboxChange} className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"/>
              </div>
              <div className="flex-1 text-sm text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-1">Declaration & Legal Agreement (घोषणा) *</span>
                मैं प्रमाणित करता हूँ कि मेरे द्वारा दी गई सभी जानकारी सत्य है। मैं सहमत हूँ कि Bihar Survey Sahayak केवल एक डिजिटल प्लेटफॉर्म है और मेरे द्वारा किए गए किसी भी कार्य, मापी, या वित्तीय लेन-देन के लिए वेबसाइट ज़िम्मेदार नहीं होगी। 
                मैंने <a href="/terms-and-conditions" target="_blank" className="text-blue-600 hover:underline font-semibold">Terms & Conditions</a> पढ़ और स्वीकार कर लिया है।
                
                <span className="block mt-3 p-3 bg-red-100 text-red-800 font-bold rounded-lg border border-red-200 text-xs">
                  महत्वपूर्ण: यदि किसी भी ग्राहक (Client) द्वारा आपके खिलाफ धोखाधड़ी या दुर्व्यवहार की रिपोर्ट की जाती है, तो आपकी प्रोफाइल स्थायी रूप से स्थगित ब्लॉक (Blocked) कर दी जाएगी।
                </span>
              </div>
            </label>
            {errors.acceptedTerms && (
              <p className="text-red-500 text-xs font-bold mt-3 pl-8 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.acceptedTerms}
              </p>
            )}
          </div>

          {/* FREE TRIAL INFO & SAVE DRAFT / PREVIEW SECTION */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-white to-emerald-100 border border-emerald-200 rounded-3xl p-6 md:p-8 shadow-lg">
            {/* Decorative Blur Circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-100/40 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left Content */}
              <div className="flex-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-bold shadow-sm mb-4">
                   LIMITED FREE OFFER
                </div>
                {/* Heading */}
                <h4 className="font-extrabold text-2xl md:text-3xl text-emerald-900 leading-snug mb-3">
                  3-Day Free Trial & Live Profile
                  <span className="block text-lg md:text-xl text-emerald-700 font-semibold mt-1">
                    (3 दिन का फ्री (Free) ट्रायल प्रोफ़ाइल )
                  </span>
                </h4>
                {/* Description */}
                <p className="text-sm md:text-base text-emerald-800 leading-relaxed max-w-3xl">
                  अपनी प्रोफ़ाइल को <span className="font-bold text-emerald-900">3 दिनों तक बिल्कुल FREE</span> लाइव करें।  
                  नीचे अपने आवश्यक दस्तावेज़ अपलोड करें।  
                  Verification पूरा होने के बाद आपकी प्रोफ़ाइल वेबसाइट पर लाइव दिखाई देगी।
                </p>
                {/* Note */}
                <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                   फ्री FREE ट्रायल समाप्त होने के बाद प्रोफ़ाइल को दोबारा लाइव रखने के लिए <span className="font-bold text-green-500">₹199/months</span> का भुगतान आवश्यक होगा।
                </div>
              </div>

              {/* Right Button */}
              {profileStatus !== "live" && (
                <div className="w-full lg:w-auto">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSubmit("preview")}
                    className="group w-full lg:w-auto px-6 py-2 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-emerald-300/50 hover:scale-[1.02] disabled:opacity-60"
                  >
                    <Eye size={22} className="group-hover:scale-110 transition-transform" />
              
                    <div className="text-left">
                      <div className="text-sm md:text-base">
                        Save Draft & Preview
                      </div>
                      <div className="text-xs text-emerald-100 font-medium">
                        ड्राफ्ट सेव करें
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* KYC & DOCUMENT UPLOAD SECTION */}
          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200 mt-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2 mb-4">
              <FileText size={20} className="text-emerald-500" />Documents Verification  ( दस्तावेज़ सत्यापन )
            </h3>
            
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex gap-3 text-amber-800 text-sm">
              <AlertCircle size={20} className="shrink-0 text-amber-600" />
              <p>Upload your Aadhaar first to unlock the Certificate section. These are kept secure and are never shown to the public. (प्रमाण पत्र अनुभाग खोलने के लिए पहले अपना आधार अपलोड करें। ये सुरक्षित रखे जाते हैं।)</p>
            </div>

            {!hasFormalCertificate && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-blue-800 font-bold text-sm">Need a Self-Declaration Form? स्व-घोषणा पत्र </h4>
                  <p className="text-blue-600 text-xs">Print this blank form, sign it, and upload it below.</p>
                </div>
                <a 
                  href="/assets/Amin-Self-Declaration-Form.pdf" 
                  download 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Download PDF
                </a>
              </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Aadhaar Upload */}
               <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors flex flex-col justify-between bg-white">
                 <div>
                   <FileText size={32} className="mx-auto text-slate-400 mb-3" />
                   <h4 className="font-bold text-slate-700 mb-1">1. Please Upload Self Attested Aadhaar Card <br/> (कृपया स्व-प्रमाणित आधार अपलोड करें)</h4>
                         
                   {/* ADDED LIMIT TEXT HERE */}
                   <p className="text-xs text-slate-500 mb-4">Front and Back with your signature (JPG, PNG, PDF)<br/> <span className="font-bold text-slate-700">Max File Size: 800 KB</span></p>
                 </div>
                         
                 {formData.aadhaarUrl ? (
                   <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                     <span className="text-emerald-700 font-bold text-sm flex items-center gap-1"><CheckCircle2 size={16} /> Uploaded (अपलोड हो गया)</span>
                     <a href={formData.aadhaarUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline flex items-center gap-1 mt-1">
                       <ExternalLink size={12}/> View Document (दस्तावेज़ देखें)
                     </a>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center gap-3">
                     <label className="cursor-pointer bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 w-max mx-auto">
                       <FileText size={16} /> Select File (फाइल चुनें)
                       <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileSelect(e, 'aadhaarUrl')} />
                     </label>
                     
                     {/* SHOW ERROR IF FILE WAS TOO BIG */}
                     {fileErrors['aadhaarUrl'] && (
                       <p className="text-xs text-red-600 font-bold mt-2 flex items-center gap-1">
                         <AlertCircle size={14} /> {fileErrors['aadhaarUrl']}
                       </p>
                     )}
                     
                     {selectedFiles['aadhaarUrl'] && (
                       <div className="flex flex-col items-center gap-2 w-full mt-2 border-t pt-3 border-slate-100">
                         <span className="text-xs text-slate-600 font-medium truncate max-w-[200px]">{selectedFiles['aadhaarUrl'].name}</span>
                         <button type="button" onClick={() => handleFileUpload('aadhaarUrl')} disabled={uploadingDoc === 'aadhaarUrl'} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors w-full">
                           {uploadingDoc === 'aadhaarUrl' ? 'Uploading...' : 'Upload Now (अभी अपलोड करें)'}
                         </button>
                       </div>
                     )}
                   </div>
                 )}
               </div>

              {/* Certificate Upload (Disabled until Aadhaar is present) */}
              <div className={`border-2 border-dashed ${isAadhaarUploaded ? 'border-slate-200 hover:bg-slate-50 bg-white' : 'border-slate-100 bg-slate-100/50 opacity-60'} rounded-2xl p-6 transition-colors flex flex-col justify-between relative`}>
                
                {/* Overlay preventing clicks if disabled */}
                {!isAadhaarUploaded && (
                  <div className="absolute inset-0 z-10 cursor-not-allowed"></div>
                )}

                <div>
                  <div className="flex items-center justify-center mb-2">
                    <h4 className="font-bold text-slate-700 text-center w-full">2. Professional Proof (पेशेवर प्रमाण)</h4>
                  </div>
                  {!isAadhaarUploaded && (
                    <p className="text-xs text-red-500 text-center mb-3 font-bold">Please upload Aadhaar first</p>
                  )}
                  <div className="flex justify-center gap-4 mb-4">
                    <label className={`flex items-center gap-2 text-sm ${!isAadhaarUploaded || noFormalCert ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input type="radio"  name="certType" checked={hasFormalCertificate} onChange={() => setHasFormalCertificate(true)} disabled={!isAadhaarUploaded || noFormalCert} className="text-emerald-600" />
                      Certificate
                    </label>
                    <label className={`flex items-center gap-2 text-sm ${!isAadhaarUploaded || !noFormalCert ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input type="radio" name="certType" checked={!hasFormalCertificate} onChange={() => setHasFormalCertificate(false)} disabled={!isAadhaarUploaded || !noFormalCert} className="text-emerald-600" />
                      Self-Declaration
                    </label>
                  </div>
                </div>

                {hasFormalCertificate ? (
                   <div className="text-center">
                     <p className="text-xs text-slate-500 mb-4">ITI/Amanat Training Certificate</p>
                     {formData.certificateUrl ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                        <span className="text-emerald-700 font-bold text-sm flex items-center gap-1">
                          <CheckCircle2 size={16} /> Uploaded (अपलोड हो गया)
                        </span>
                        <a href={formData.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink size={12}/> View Document (दस्तावेज़ देखें)
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <label className={`bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 w-max mx-auto ${!isAadhaarUploaded ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100'}`}>
                          <FileText size={16} /> Select Certificate (फाइल चुनें)
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*,.pdf" 
                            onChange={(e) => handleFileSelect(e, 'certificateUrl')} 
                            disabled={!isAadhaarUploaded} 
                          />
                        </label>

                        {/* Display file size error if any */}
                        {fileErrors?.certificateUrl && (
                          <p className="text-xs text-red-600 font-bold mt-2 flex items-center gap-1">
                            <AlertCircle size={14} /> {fileErrors.certificateUrl}
                          </p>
                        )}

                        {/* Show upload button only if a valid file is selected */}
                        {selectedFiles['certificateUrl'] && !fileErrors?.certificateUrl && (
                          <div className="flex flex-col items-center gap-2 w-full mt-2 border-t pt-3 border-slate-100">
                            <span className="text-xs text-slate-600 font-medium truncate max-w-[200px]">
                              {selectedFiles['certificateUrl'].name}
                            </span>
                            <button 
                              type="button" 
                              onClick={() => handleFileUpload('certificateUrl')} 
                              disabled={uploadingDoc === 'certificateUrl'} 
                              className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors w-full z-20"
                            >
                              {uploadingDoc === 'certificateUrl' ? 'Uploading...' : 'Upload Now (अभी अपलोड करें)'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                   </div>
                ) : (
                   <div className="text-center">
                     <p className="text-xs text-slate-500 mb-4">Self-Affidavit</p>
                     {formData.experienceLetterUrl ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                          <span className="text-emerald-700 font-bold text-sm flex items-center gap-1"><CheckCircle2 size={16} /> Uploaded (अपलोड हो गया)</span>
                          <a href={formData.experienceLetterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline flex items-center gap-1 mt-1">
                            <ExternalLink size={12}/> View Document (दस्तावेज़ देखें)
                          </a>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <label className={`bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 w-max mx-auto ${!isAadhaarUploaded ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <FileText size={16} /> Select Letter (फाइल चुनें)
                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileSelect(e, 'experienceLetterUrl')} disabled={!isAadhaarUploaded} />
                          </label>
                          {/* Display file size error if any */}
                            {fileErrors?.experienceLetterUrl && (
                              <p className="text-xs text-red-600 font-bold mt-2 flex items-center gap-1">
                                <AlertCircle size={14} /> {fileErrors.experienceLetterUrl}
                              </p>
                            )}
                          {selectedFiles['experienceLetterUrl'] && (
                            <div className="flex flex-col items-center gap-2 w-full mt-2 border-t pt-3 border-slate-100">
                              <span className="text-xs text-slate-600 font-medium truncate max-w-[200px]">{selectedFiles['experienceLetterUrl'].name}</span>
                              <button type="button" onClick={() => handleFileUpload('experienceLetterUrl')} disabled={uploadingDoc === 'experienceLetterUrl'} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors w-full z-20">
                                {uploadingDoc === 'experienceLetterUrl' ? 'Uploading...' : 'Upload Now (अभी अपलोड करें)'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                   </div>
                )}
              </div>
            </div>
          </div>
          
          {/* FINAL SUBMISSION & ACTION BUTTONS (BOTTOM) */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mt-8">

            {!hasUploadedDocs ? (
              // State 1: Needs Documents
              <div className="w-full sm:w-auto px-6 py-4 bg-slate-100 text-slate-400 font-bold rounded-xl flex items-center justify-center text-sm cursor-not-allowed text-center">
                Upload Docs Above to Submit <br/> (सत्यापन के लिए दस्तावेज़ अपलोड करें)
              </div>

            ) : (profileStatus === "draft" || profileStatus === "rejected") ? (
              // State 2: Ready for Verification
              <button type="button" disabled={isSaving} onClick={() => handleSubmit("submitVerification")} className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={20} /> Submit for Verification (सत्यापन के लिए भेजें)
              </button>

            ) : profileStatus === "pending" ? (
               // State 3: Pending Verification
               <div className="w-full sm:w-auto px-8 py-4 bg-amber-100 text-amber-700 font-bold rounded-xl flex items-center justify-center gap-2">
                 <Clock size={20} /> Under Verification (सत्यापन प्रक्रिया में)
               </div>

            ) : profileStatus === "live" ? (
               // State 4: Live (Update Info or Extend Payment)
               <>
                <button type="button" disabled={isSaving} onClick={() => handleSubmit("update")} className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                  <Save size={20} /> Update Info
                </button>
            
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-start sm:items-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-4">
                  {/* Pay via Wallet to Extend */}
                  <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
                    <button 
                      type="button" 
                      disabled={isSaving || (existingData?.walletBalance || 0) < 199} 
                      onClick={handleWalletPayment} 
                      className={`w-full px-6 py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm ${
                        (existingData?.walletBalance || 0) >= 199 
                          ? "bg-slate-800 hover:bg-slate-900 text-white" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <CreditCard size={18} /> Extend via Wallet
                    </button>
                    <span className={`text-xs font-bold ${(existingData?.walletBalance || 0) >= 199 ? "text-emerald-600" : "text-red-500"}`}>
                      Bal: ₹{existingData?.walletBalance || 0}
                    </span>
                  </div>
                    
                  {/* Pay via Razorpay to Extend */}
                  <button type="button" disabled={isSaving} onClick={() => handleSubmit("pay")} className="w-full sm:w-auto px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg h-[56px] mt-0 sm:mt-[-20px]">
                    <ExternalLink size={18} /> Extend via UPI
                  </button>
                </div>
               </>
            ) : (
               // State 5: Expired (Must Pay to Reactivate)
               <div className="flex flex-col sm:flex-row items-center justify-end gap-4 w-full">
                  {/* Pay via Wallet */}
                  <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
                    <button 
                      type="button" 
                      disabled={isSaving || (existingData?.walletBalance || 0) < 199} 
                      onClick={handleWalletPayment} 
                      className={`w-full px-8 py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                        (existingData?.walletBalance || 0) >= 199 
                          ? "bg-slate-800 hover:bg-slate-900 text-white" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <CreditCard size={20} /> Pay via Wallet
                    </button>
                    <span className={`text-[11px] font-bold ${(existingData?.walletBalance || 0) >= 199 ? "text-emerald-600" : "text-red-500"}`}>
                      Wallet Balance: ₹{existingData?.walletBalance || 0}
                    </span>
                  </div>
                    
                  <span className="text-slate-400 font-bold text-sm hidden sm:block mt-[-20px]">OR</span>
                    
                  {/* Pay via Razorpay */}
                  <button 
                    type="button" 
                    disabled={isSaving} 
                    onClick={() => handleSubmit("pay")} 
                    className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/30 h-[56px] mt-0 sm:mt-[-20px]"
                  >
                    <ExternalLink size={20} /> Pay ₹199 via UPI/Card
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}