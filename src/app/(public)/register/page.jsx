"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { locations } from '../data/locations';
import { Eye, EyeOff, User, Store, Phone, Mail, MapPin, Lock, CheckCircle2, TrendingUp, Printer, IndianRupee, Briefcase, Users, AlertCircle } from "lucide-react";

//const districts = ["Patna", "Gaya", "Muzaffarpur", "Darbhanga", "Bhagalpur", "Purnia", "Samastipur", "Nalanda", "Arrah", "Begusarai", "Katihar"];

// User types with descriptions for the "Earnings" feel
{/* id: "csc", label: "CSC Operator", icon: <Briefcase size={16}/>*/}
const userTypes = [
  { id: "amin", label: "Amin", icon: <FileText size={16}/> },
  { id: "cyber_cafe", label: "Cyber Cafe", icon: <Store size={16}/> },
  
  { id: "normal", label: "Citizen / Normal User", icon: <Users size={16}/> },
];

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // NEW: Added state to catch errors from your database (like "Email already exists")
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    userType: "", // Default
    ownerName: "",
    shopName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    district: "",
    block: "",
    pincode: "",
    acceptedDeclaration: false
  });

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");

  // 1. Extract the list of districts dynamically from the imported data
  const districts = locations.map(loc => loc.district);

  // 2. Find the blocks for the currently selected district
  const availableBlocks = locations.find(loc => loc.district === formData.district)?.blocks || [];

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
  // 1. Destructure type and checked alongside name and value
  const { name, value, type, checked } = e.target;
  
  // 2. Determine the raw new value (boolean for checkboxes, string for everything else)
  let newValue = type === "checkbox" ? checked : value;

  // 3. Handle external state specifically for dropdowns
  if (name === "district") {
    setSelectedDistrict(newValue);
    setSelectedBlock(""); // Reset block selection when district changes
  }

  // 4. Strict input masking (only apply to strings, not booleans)
  if (type !== "checkbox") {
    if (name === "mobileNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
      newValue = value.replace(/^[0-5]+/,"");
    } else if (name === "pincode") {
      newValue = value.replace(/\D/g, "").slice(0, 6);
    } else if (name === "password" || name === "confirmPassword") {
      newValue = value.slice(0, 8); // Max 8 chars
    }
  }

  // 5. Update the main formData state using the functional update pattern
  setFormData((prevData) => ({ 
    ...prevData, 
    [name]: newValue 
  }));
  
  // 6. Clear errors on typing
  if (errors[name]) {
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  }
  if (apiError) setApiError(""); // Clear database error when user types
};

  const getStrengthScore = () => {
    const p = formData.password;
    if (!p) return 0;
    
    let score = 1; // 1 Bar: User started typing (Red)
    
    if (p.length >= 6) {
      score = 2; // 2 Bars: Reached minimum length (Yellow)
    }
    
    // 3 Bars: Has length AND Uppercase AND Number AND Special Character (Green)
    if (p.length >= 6 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[@$!%*?&#]/.test(p)) {
      score = 3; 
    }
    
    return score;
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.ownerName) newErrors.ownerName = "Name is required";
    if (formData.userType !== "normal" && !formData.shopName) newErrors.shopName = "Business name is required";
    
    if (formData.mobileNumber.length !== 10) newErrors.mobileNumber = "Must be exactly 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email address";
    
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.district) newErrors.district = "Please select a district";
    if (formData.pincode.length !== 6) newErrors.pincode = "Must be exactly 6 digits";

    // Strict Password Validation (6-8 chars + pattern)
    if (formData.password.length < 6 || formData.password.length > 8) {
      newErrors.password = "Password must be 6-8 characters";
    } else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password) || !/[@$!%*?&#]/.test(formData.password)) {
      newErrors.password = "Ex: Abc@123 (Upper, Number, Special)";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userType) {
        // Handle the error (e.g., set an error state, show a toast notification)
        alert("Please select a Registration Category");
        return;
    }
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      // THIS IS THE FIX: Actually send data to your MongoDB API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // If the API returns a 400 or 500 error, throw it so the catch block handles it
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong during registration.");
      }

      // Success! Set the real ID from the database and show the success screen
      setGeneratedId(data.generatedId);
      setIsRegistered(true);

    } catch (err) {
      // Display the error from the backend (like "User already exists")
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Account Activated</h2>
          <p className="text-slate-500 mt-2 text-sm italic">Welcome to the Bihar Survey Sahayak Network.</p>
          
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-2xl text-left text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-widest opacity-80">Authorized {formData.userType.replace('_', ' ')} ID</p>
              <h3 className="text-2xl font-mono font-bold mt-1">{generatedId}</h3>
              <div className="mt-6">
                <p className="text-[10px] uppercase opacity-70">Operator Name</p>
                <p className="font-semibold text-sm">{formData.ownerName}</p>
              </div>
            </div>
          </div>

          <button onClick={() => router.push("/login")} className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all">
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-white">
        
        {/* Left Side: Business Motivation */}
        <div className="md:w-80 bg-[#1e293b] p-8 text-white flex flex-col">
          <h1 className="text-xl font-bold tracking-tight mb-8">Bihar Survey Sahayak</h1>
          <div className="space-y-8 flex-grow">
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase mb-4 tracking-widest">Why Join Us?</p>
              <div className="space-y-4">
                <FeatureItem icon={<Printer size={16}/>} title="High-Speed Printing" desc="Prapatra 2, 3, and Vanshavali in one click." />
                <FeatureItem icon={<IndianRupee size={16}/>} title="Earning Potential" desc="Increase your earning + " />
                {/*<FeatureItem icon={<CheckCircle2 size={16}/>} title="Verified ID" desc="Get a unique ID for your shop or profile." />*/}
              </div>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-2xl">
              <p className="text-xs text-blue-200 leading-relaxed">
                Empowering Bihar's digital service points with modern tools.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Form */}
        <div className="flex-1 p-8 lg:p-12">
          <header className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Registration</h2>
            <p className="text-slate-500 text-sm mt-1">Select your role to unlock customized tools.</p>
          </header>

          {/* NEW: Display API Errors here */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start gap-3 rounded-r-lg">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* USER TYPE DROPDOWN */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-tighter">Registration Category</label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-blue-600"><Users size={18} /></div>
                <select 
                  name="userType" 
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="" disabled>Select Registration Category</option>
                  {userTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <FormInput label="Full Name" icon={<User size={18}/>} name="ownerName" placeholder="Name" value={formData.ownerName} error={errors.ownerName} onChange={handleChange} />
              
              {/* Dynamic Field: Only show Shop Name for business types */}
              {formData.userType !== "normal" && (
                <FormInput label="Shop / Business Name" icon={<Store size={18}/>} name="shopName" placeholder="Enter shop / business name" value={formData.shopName} error={errors.shopName} onChange={handleChange} />
              )}
              
              <FormInput label="Mobile Number" icon={<Phone size={18}/>} name="mobileNumber" placeholder="10-digit Number" value={formData.mobileNumber} error={errors.mobileNumber} onChange={handleChange} />
              <FormInput label="Email" icon={<Mail size={18}/>} name="email" placeholder="Official Email" value={formData.email} error={errors.email} onChange={handleChange} />
            </div>

            <div className="grid md:grid-cols-4 gap-5 items-start">
  
  {/* Full Address: Takes 3/4 of the first row */}
  <div className="md:col-span-3">
    <FormInput 
      label="Full Address" 
      icon={<MapPin size={18}/>} 
      name="address" 
      placeholder="Vill, Post, Thana" 
      value={formData.address} 
      error={errors.address} 
      onChange={handleChange} 
    />
  </div>

  {/* Pincode: Takes 1/4 of the first row */}
  <div className="md:col-span-1">
    <FormInput 
      label="Pincode" 
      icon={<MapPin size={18}/>} 
      name="pincode" 
      placeholder="6-digit Pincode" 
      value={formData.pincode} 
      error={errors.pincode} 
      onChange={handleChange} 
    />
  </div>

  {/* District: Takes 1/2 of the second row */}
  <div className="md:col-span-2 flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-tighter">District</label>
    <select 
      name="district" 
      value={formData.district} 
      onChange={handleChange} 
      className={`w-full h-[46px] px-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${errors.district ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20'}`}
    >
      <option value="">District</option>
      {districts.map(d => (
        <option key={d} value={d}>
          {d.charAt(0).toUpperCase() + d.slice(1)}
        </option>
      ))}
    </select>
    {errors.district && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.district}</p>}
  </div>

  {/* Block: Takes 1/2 of the second row */}
  <div className="md:col-span-2 flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-tighter">Block</label>
    <select 
      name="block" 
      value={formData.block} 
      onChange={handleChange} 
      disabled={!formData.district}
      className={`w-full h-[46px] px-3 ${!formData.district ? 'bg-slate-200 cursor-not-allowed opacity-60' : 'bg-slate-50'} border rounded-xl text-sm outline-none transition-all ${errors.block ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20'}`}
    >
      <option value="">Block</option>
      {availableBlocks.map(b => (
        <option key={b} value={b}>
          {b.charAt(0).toUpperCase() + b.slice(1)}
        </option>
      ))}
    </select>
    {errors.block && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.block}</p>}
  </div>

</div>

            {/* Password Section */}
            <div className="grid md:grid-cols-2 gap-5 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-tighter">Secure Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400"><Lock size={18}/></div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password}
                    onChange={handleChange} 
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-blue-500'}`} 
                    placeholder="Ex: Abc@123" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-500 font-medium ml-1 leading-tight">{errors.password}</p>}
                
                {/* Progressive Strength Meter */}
                <div className="flex gap-1.5 mt-2 px-0.5">
                  <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${getStrengthScore() >= 1 ? (getStrengthScore() === 3 ? 'bg-emerald-500' : 'bg-red-500') : 'bg-slate-200'}`}></div>
                  <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${getStrengthScore() >= 2 ? (getStrengthScore() === 3 ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-slate-200'}`}></div>
                  <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${getStrengthScore() === 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-tighter">Confirm Access</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400"><Lock size={18}/></div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleChange} 
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-blue-500'}`} 
                    placeholder="••••••••" 
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-slate-400">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-red-500 font-medium ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* --- Declaration Section --- */}
            <div className="flex items-start gap-3 mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center h-5 mt-1">
                <input
                  id="declaration"
                  name="acceptedDeclaration"
                  type="checkbox"
                  checked={formData.acceptedDeclaration || false}
                  onChange={(e) => setFormData({ ...formData, acceptedDeclaration: e.target.checked })}
                  className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded cursor-pointer focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex-1 text-sm text-slate-600 leading-relaxed">
                <label htmlFor="declaration" className="cursor-pointer select-none">
                  <span className="font-bold text-slate-800 block mb-1">Declaration & Legal Agreement (घोषणा) *</span>
                    मैं प्रमाणित करता हूँ कि एक साइबर कैफे संचालक / ऑपरेटर और अमीन  के रूप में मेरे द्वारा दी गई सभी जानकारी सत्य है। मैं सहमत हूँ कि Bihar Survey Sahayak केवल एक डिजिटल टूल है। मेरे ग्राहकों के लिए दर्ज किए गए डेटा, जनरेट किए गए दस्तावेज़ों (जैसे वंशावली/बंटवारा) और ग्राहकों के साथ मेरे किसी भी वित्तीय लेन-देन की पूरी ज़िम्मेदारी मेरी होगी, इसके लिए वेबसाइट ज़िम्मेदार नहीं होगी। 
                    मैंने <a href="/terms-and-conditions" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold ml-1" onClick={(e) => e.stopPropagation()}>
                       Terms & Conditions
                    </a> पढ़ और स्वीकार कर लिया है।
                </label>
                {errors.acceptedDeclaration && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.acceptedDeclaration}</p>}
              </div>
            </div>
            <button type="submit" disabled={loading || !formData.acceptedDeclaration} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] mt-4 text-xs uppercase tracking-widest disabled:opacity-50">
              {loading ? "Saving to Database..." : "Get Authorized Access"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-100">{title}</p>
        <p className="text-[11px] text-slate-400 leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function FormInput({ label, icon, name, placeholder, value, error, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-tighter">{label}</label>
      <div className="relative group">
        <div className={`absolute left-3 top-3 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-500'}`}>
          {icon}
        </div>
        <input 
          type="text" 
          name={name} 
          value={value}
          onChange={onChange} 
          className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl text-sm focus:bg-white outline-none transition-all ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`} 
          placeholder={placeholder} 
        />
        {error && <AlertCircle size={16} className="absolute right-3 top-3.5 text-red-500" />}
      </div>
      {error && <p className="text-[10px] text-red-500 font-medium ml-1">{error}</p>}
    </div>
  );
}

function FileText({size}) { return <Printer size={size}/> } // Fallback icon