import { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";

export default function TermsModal({ userData, onTermsAccepted }) {
  const [showTerms, setShowTerms] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we need to show the modal when the component loads
  useEffect(() => {
    if (userData && !userData.acceptedDeclaration) {
      setShowTerms(true);
    }
  }, [userData]);

  const handleAcceptTerms = async () => {
    if (!isChecked) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/accept-terms", {
        method: "POST"
      });
      
      const data = await res.json();

      if (res.ok && data.success) {
        setShowTerms(false);
        if (onTermsAccepted) onTermsAccepted(); // Optional callback to update parent state
      } else {
        alert(data.message || "Failed to accept terms. Please try again.");
      }
    } catch (error) {
      console.error("Failed to accept terms:", error);
      alert("Something went wrong. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showTerms) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-6 text-white flex items-start gap-4">
          <div className="bg-blue-500/50 p-2 rounded-lg">
            <ShieldAlert size={28} className="text-blue-50" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight mb-1">Action Required</h2>
            <p className="text-blue-100 text-sm font-medium leading-snug">
              Please review and accept our updated terms to continue using the dashboard.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div 
            className={`transition-colors duration-300 border-2 rounded-xl p-4 mb-6 cursor-pointer ${
              isChecked ? "bg-blue-50 border-blue-500" : "bg-slate-50 border-slate-200 hover:border-blue-300"
            }`}
            onClick={() => setIsChecked(!isChecked)}
          >
            <div className="flex items-start gap-3">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  id="declaration" 
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer pointer-events-none"
                  checked={isChecked}
                  readOnly // Controlled by the parent div onClick
                />
              </div>
              <label htmlFor="declaration" className="cursor-pointer select-none text-[13px] leading-relaxed text-slate-600">
                <span className="font-bold text-slate-900 block mb-1.5 text-[15px]">
                  Declaration & Legal Agreement (घोषणा) *
                </span>
                मैं प्रमाणित करता हूँ कि एक साइबर कैफे संचालक / ऑपरेटर और अमीन के रूप में मेरे द्वारा दी गई सभी जानकारी सत्य है। मैं सहमत हूँ कि <strong className="text-slate-800">Bihar Survey Sahayak</strong> केवल एक डिजिटल टूल है। मेरे ग्राहकों के लिए दर्ज किए गए डेटा, जनरेट किए गए दस्तावेज़ों (जैसे वंशावली/बंटवारा) और ग्राहकों के साथ मेरे किसी भी वित्तीय लेन-देन की पूरी ज़िम्मेदारी मेरी होगी, इसके लिए वेबसाइट ज़िम्मेदार नहीं होगी।
                
                <span className="block mt-3 pt-3 border-t border-slate-200">
                  मैंने 
                  <a href="/terms-and-conditions" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-bold mx-1" onClick={(e) => e.stopPropagation()}>
                    Terms & Conditions
                  </a> 
                  पढ़ और स्वीकार कर लिया है।
                </span>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleAcceptTerms}
            disabled={!isChecked || isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-base flex justify-center items-center gap-2 transition-all duration-200 ${
              isChecked && !isLoading 
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98]" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                I Agree & Continue (सहमत हूँ)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}