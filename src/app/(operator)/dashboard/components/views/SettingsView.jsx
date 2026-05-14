import { useState, useEffect } from "react";
import React from "react";
import { CheckCircle2, AlertTriangle, User, Store, Phone, Mail, MapPin, Clock, Save } from "lucide-react";
import FloatingSupport from "./FloatingSupport";

export default function SettingsView({ userData, setUserData }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [profileFormData, setProfileFormData] = useState({
    ownerName: "", shopName: "", mobileNumber: "", address: "", district: "", block: "", pincode: ""
  });

  useEffect(() => {
    if (userData && !isEditingProfile) {
      setProfileFormData({
        ownerName: userData.ownerName || "", shopName: userData.shopName || "", mobileNumber: userData.mobileNumber || "",
        address: userData.address || "", district: userData.district || "", block: userData.block || "", pincode: userData.pincode || "",
      });
    }
  }, [userData, isEditingProfile]);

  const handleProfileChange = (e) => setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profileFormData),
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
        setIsEditingProfile(false);
        setProfileMsg({ text: "Profile updated successfully!", type: "success" });
        setTimeout(() => setProfileMsg({ text: "", type: "" }), 4000);
      } else {
        setProfileMsg({ text: "Failed to update profile.", type: "error" });
      }
    } catch (error) { setProfileMsg({ text: "Network error occurred.", type: "error" }); } 
    finally { setIsUpdatingProfile(false); }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Account Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your official operator profile and business details.</p>
        </div>
        {!isEditingProfile && (
          <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
            Edit Profile
          </button>
        )}
      </header>

      {profileMsg.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {profileMsg.type === 'success' ? <CheckCircle2 size={18}/> : <AlertTriangle size={18}/>}
          {profileMsg.text}
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-100 mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-black uppercase shadow-md">
              {userData?.ownerName?.substring(0, 2) || "OP"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{userData?.ownerName || "Loading..."}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md uppercase tracking-wider">{userData?.userType ? userData.userType.replace('_', ' ') : "Operator"}</span>
                <span className="text-xs text-slate-500 font-medium border-l border-slate-300 pl-2">ID: {userData?.userId || "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Status</p>
            <p className="text-sm font-black text-emerald-600 flex items-center gap-1 justify-end"><CheckCircle2 size={14} /> Active</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="grid md:grid-cols-2 gap-6">
            <InputField icon={<User/>} label="Owner Name" name="ownerName" value={profileFormData.ownerName} onChange={handleProfileChange} isEditing={isEditingProfile} />
            <InputField icon={<Store/>} label="Business / Shop Name" name="shopName" value={profileFormData.shopName} onChange={handleProfileChange} isEditing={isEditingProfile} />
            <InputField icon={<Phone/>} label="Mobile Number" name="mobileNumber" value={profileFormData.mobileNumber} onChange={handleProfileChange} isEditing={isEditingProfile} />
            <InputField icon={<Mail/>} label="Email Address (Read Only)" name="email" value={userData?.email || "N/A"} isEditing={false} disabled />
            <div className="md:col-span-2">
              <InputField icon={<MapPin/>} label="Local Address" name="address" value={profileFormData.address} onChange={handleProfileChange} isEditing={isEditingProfile} />
            </div>
            <InputField icon={<MapPin/>} label="District" name="district" value={profileFormData.district} onChange={handleProfileChange} isEditing={isEditingProfile} />
            <InputField icon={<MapPin/>} label="Block" name="block" value={profileFormData.block} onChange={handleProfileChange} isEditing={isEditingProfile} />
            <InputField icon={<MapPin/>} label="Pincode" name="pincode" value={profileFormData.pincode} onChange={handleProfileChange} isEditing={isEditingProfile} />
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {isEditingProfile ? (
              <>
                <p className="text-xs text-blue-600 font-medium">You are currently editing your profile.</p>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" disabled={isUpdatingProfile} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50">
                    {isUpdatingProfile ? "Saving..." : <><Save size={16}/> Save Changes</>}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock size={14} className="text-slate-300"/> Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
              </p>
            )}
          </div>
        </form>
        <FloatingSupport/>
      </div>
    </div>
  );
}

function InputField({ icon, label, name, value, onChange, isEditing, disabled }) {
  const readOnly = disabled || !isEditing;
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-wider">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-3.5 text-blue-500">{icon && React.cloneElement(icon, { size: 16 })}</div>
        <input 
          type="text" name={name} required={!disabled} disabled={readOnly} value={value} onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium transition-all ${!readOnly ? 'bg-white border-2 border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100' : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'}`}
        />
      </div>
    </div>
  );
}