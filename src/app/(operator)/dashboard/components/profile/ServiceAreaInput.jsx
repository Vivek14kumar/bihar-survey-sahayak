"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ServiceAreaInput({ formData, setFormData }) {
  const [inputValue, setInputValue] = useState("");

  // सुरक्षित तरीका: यह सुनिश्चित करता है कि serviceAreas हमेशा एक Array ही रहे
  const serviceAreas = (() => {
  if (Array.isArray(formData?.serviceAreas)) {
    return formData.serviceAreas;
  }
  // अगर डेटाबेस से गलती से String के रूप में डेटा आ जाए, तो उसे Array में बदल दे
  if (typeof formData?.serviceAreas === 'string' && formData.serviceAreas.trim() !== '') {
    return formData.serviceAreas.split(',').map(item => item.trim());
  }
  return [];
})();

  const handleKeyDown = (e) => {
    // Space, Enter, Tab या Comma (,) दबाने पर
    if (['Enter', 'Tab', ',', ' '].includes(e.key)) {
      e.preventDefault(); // फॉर्म को सबमिट होने से रोके
      
      const newArea = inputValue.trim();
      
      // अगर बॉक्स खाली नहीं है और यह नाम पहले से मौजूद नहीं है
      if (newArea && !serviceAreas.includes(newArea)) {
        setFormData({
          ...formData,
          serviceAreas: [...serviceAreas, newArea]
        });
      }
      setInputValue(""); // इनपुट बॉक्स खाली करें
    }
    
    // Backspace से टैग डिलीट करना
    if (e.key === 'Backspace' && inputValue === '' && serviceAreas.length > 0) {
      const newAreas = [...serviceAreas];
      newAreas.pop();
      setFormData({ ...formData, serviceAreas: newAreas });
    }
  };

  const removeArea = (indexToRemove) => {
    const newAreas = serviceAreas.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, serviceAreas: newAreas });
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-2">
        Service Areas <span className="text-xs font-normal text-slate-400">(Space या Enter दबाकर जोड़ें)</span>
      </label>
      
      <div 
        className="w-full min-h-[52px] p-2 flex flex-wrap gap-2 rounded-xl border bg-slate-50 border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500 transition-all cursor-text"
        onClick={() => document.getElementById("service-area-input")?.focus()}
      >
        {/* टैग्स (Chips) दिखाना */}
        {serviceAreas.map((area, index) => (
          <span 
            key={index} 
            className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            {area}
            <button
              type="button" // यह बहुत ज़रूरी है ताकि फॉर्म सबमिट न हो
              onClick={() => removeArea(index)}
              className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        {/* टाइप करने वाला बॉक्स */}
        <input
          id="service-area-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={serviceAreas.length === 0 ? "Patna, Danapur, Fatuha..." : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none py-1 px-2 text-slate-700"
        />
      </div>
    </div>
  );
}