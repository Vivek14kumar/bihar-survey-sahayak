import React, { useState } from 'react';
import { Mail, X, HelpCircle, Copy, Check } from 'lucide-react';

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedItem, setCopiedItem] = useState(""); // Tracks which item was copied

  // Replace these with your actual details
  const whatsappNumber = "918676880507"; // Country code + number (No plus sign or spaces)
  const displayWhatsapp = "86768 80507";
  const supportEmail = "viktechzweb@gmail.com";

  // Function to handle copying text without triggering the link
  const handleCopy = (e, text, itemType) => {
    e.preventDefault(); // Prevents the link from opening
    e.stopPropagation(); // Stops the click from bubbling up to the wrapper
    
    navigator.clipboard.writeText(text);
    setCopiedItem(itemType);
    
    // Reset the checkmark back to a copy icon after 2 seconds
    setTimeout(() => {
      setCopiedItem("");
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* The Support Card */}
      {isOpen && (
        <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-5 w-80 mb-4 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800">Need Help?</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {/* WhatsApp Link Row */}
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hi!%20I%20need%20some%20help.`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-green-50/50 hover:bg-green-50 p-3 rounded-xl transition-all border border-green-100 hover:border-green-300"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#25D366] text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                  {/* Official WhatsApp SVG Icon */}
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">WhatsApp</p>
                  <p className="text-sm font-semibold text-green-950">{displayWhatsapp}</p>
                </div>
              </div>
              
              {/* WhatsApp Copy Button */}
              <button 
                onClick={(e) => handleCopy(e, displayWhatsapp, "whatsapp")}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                title="Copy Number"
              >
                {copiedItem === "whatsapp" ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </a>

            {/* Email Link Row */}
            <a 
              href={`mailto:${supportEmail}?subject=Support Request`} 
              className="group flex items-center justify-between bg-blue-50/50 hover:bg-blue-50 p-3 rounded-xl transition-all border border-blue-100 hover:border-blue-300"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Email Us</p>
                  <p className="text-sm font-semibold text-blue-950 truncate max-w-[160px]">{supportEmail}</p>
                </div>
              </div>

              {/* Email Copy Button */}
              <button 
                onClick={(e) => handleCopy(e, supportEmail, "email")}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                title="Copy Email"
              >
                {copiedItem === "email" ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-2 p-2 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-slate-800 text-white scale-90' 
            : 'bg-blue-700 text-white shadow-gray-500 hover:bg-blue-700 hover:scale-105 hover:shadow-gray-800/30'
        }`}
      >
        <span className=" ">
          {isOpen ? 'Close' : 'Support'}
        </span>
        {isOpen ? <X size={20} /> : <HelpCircle size={24} />}
      </button>
      
    </div>
  );
}