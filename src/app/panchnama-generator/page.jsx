"use client";

import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

// --- Auto Hindi Input Component ---
const HindiInput = ({ label, name, value, onChange, placeholder, isTextarea = false }) => {
  const [localText, setLocalText] = useState(value || '');

  const handleKeyDown = async (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      const words = localText.split(' ');
      const lastWord = words[words.length - 1];

      if (lastWord.trim() !== '') {
        try {
          // Google Transliteration API for English to Hindi
          const res = await fetch(`https://inputtools.google.com/request?text=${lastWord}&itc=hi-t-i0-und&num=1`);
          const data = await res.json();
          if (data[0] === 'SUCCESS') {
            const hindiWord = data[1][0][1][0];
            words[words.length - 1] = hindiWord;
            const newText = words.join(' ') + ' ';
            setLocalText(newText);
            // Update parent state
            onChange({ target: { name, value: newText } });
          }
        } catch (error) {
          console.error("Translation error:", error);
        }
      }
    }
  };

  const handleChange = (e) => {
    setLocalText(e.target.value);
    onChange(e); // Keep parent state in sync
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium">{label}</label>
      {isTextarea ? (
        <textarea
          name={name}
          value={localText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "English में टाइप करें और Space दबाएं..."}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={localText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "English में टाइप करें और Space दबाएं..."}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
};

// --- Main Panchnama Component ---
export default function PanchnamaGenerator() {
  // 1. Common Details State
  const [commonData, setCommonData] = useState({
    date: '',
    place: '',
    moolRaiyat: '',
    village: '',
    thanaNo: '',
    anchal: '',
    district: '',
    customConditions: ''
  });

  // 2. Dynamic Parties State (Minimum 2 parties)
  const [parties, setParties] = useState([
    { id: 1, title: 'प्रथम', name: '', age: '', khata: '', khesra: '', rakba: '', boundaries: '' },
    { id: 2, title: 'द्वितीय', name: '', age: '', khata: '', khesra: '', rakba: '', boundaries: '' }
  ]);

  const numberTitles = ['प्रथम', 'द्वितीय', 'तृतीय', 'चतुर्थ', 'पंचम', 'षष्ठम'];

  // Handlers
  const handleCommonChange = (e) => {
    setCommonData({ ...commonData, [e.target.name]: e.target.value });
  };

  const handlePartyChange = (id, e) => {
    const updatedParties = parties.map(party => 
      party.id === id ? { ...party, [e.target.name]: e.target.value } : party
    );
    setParties(updatedParties);
  };

  const addParty = () => {
    if (parties.length < 6) {
      const newId = parties.length + 1;
      setParties([...parties, { 
        id: newId, 
        title: numberTitles[newId - 1], 
        name: '', age: '', khata: '', khesra: '', rakba: '', boundaries: '' 
      }]);
    } else {
      alert("अधिकतम 6 हिस्सेदार ही जोड़े जा सकते हैं।");
    }
  };

  const removeParty = (id) => {
    if (parties.length > 2) {
      const updatedParties = parties.filter(p => p.id !== id).map((p, index) => ({
        ...p,
        id: index + 1,
        title: numberTitles[index]
      }));
      setParties(updatedParties);
    } else {
      alert("कम से कम 2 हिस्सेदार होना अनिवार्य है।");
    }
  };

  // Download PDF
  const downloadPDF = () => {
    const element = document.getElementById('panchnama-document');
    const opt = {
      margin:       0.5,
      filename:     'Batwara_Panchnama.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // Download Word (.doc)
  const downloadWord = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Panchnama</title></head><body>";
    const footer = "</body></html>";
    const htmlInfo = document.getElementById('panchnama-document').innerHTML;
    const sourceHTML = header + htmlInfo + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'Batwara_Panchnama.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 flex flex-col md:flex-row gap-8">
      
      {/* LEFT SIDE: Input Form */}
      <div className="w-full md:w-1/3 bg-white p-5 shadow rounded h-[85vh] overflow-y-auto border-t-4 border-blue-600">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">पंचनामा डिटेल्स भरें</h2>
        
        <div className="bg-blue-50 p-3 rounded mb-6 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-3">सामान्य जानकारी</h3>
          <HindiInput label="तारीख (उदा: 06 मार्च 2026)" name="date" value={commonData.date} onChange={handleCommonChange} />
          <HindiInput label="स्थान (गांव/शहर)" name="place" value={commonData.place} onChange={handleCommonChange} />
          <HindiInput label="मूल रैयत (दादा/पिता) का नाम" name="moolRaiyat" value={commonData.moolRaiyat} onChange={handleCommonChange} />
          <div className="grid grid-cols-2 gap-2">
            <HindiInput label="गांव/मौजा" name="village" value={commonData.village} onChange={handleCommonChange} />
            <HindiInput label="थाना नंबर" name="thanaNo" value={commonData.thanaNo} onChange={handleCommonChange} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <HindiInput label="अंचल" name="anchal" value={commonData.anchal} onChange={handleCommonChange} />
            <HindiInput label="जिला" name="district" value={commonData.district} onChange={handleCommonChange} />
          </div>
        </div>

        {/* Dynamic Parties */}
        {parties.map((party) => (
          <div key={party.id} className="bg-gray-50 p-3 rounded mb-4 border border-gray-200 relative">
            <h3 className="font-semibold text-gray-800 mb-3">{party.title} पक्ष का विवरण</h3>
            {parties.length > 2 && (
              <button onClick={() => removeParty(party.id)} className="absolute top-2 right-2 text-red-500 text-sm hover:underline">
                हटाएं
              </button>
            )}
            
            <HindiInput label="हिस्सेदार का नाम" name="name" value={party.name} onChange={(e) => handlePartyChange(party.id, e)} />
            <HindiInput label="उम्र (वर्ष में)" name="age" value={party.age} onChange={(e) => handlePartyChange(party.id, e)} />
            
            <div className="grid grid-cols-3 gap-2 mt-2">
              <HindiInput label="खाता नं." name="khata" value={party.khata} onChange={(e) => handlePartyChange(party.id, e)} />
              <HindiInput label="खेसरा नं." name="khesra" value={party.khesra} onChange={(e) => handlePartyChange(party.id, e)} />
              <HindiInput label="रकबा" name="rakba" value={party.rakba} onChange={(e) => handlePartyChange(party.id, e)} placeholder="उदा: 10 डिसमिल" />
            </div>
            <HindiInput label="चौहद्दी (उत्तर, दक्षिण, पूरब, पश्चिम)" name="boundaries" value={party.boundaries} onChange={(e) => handlePartyChange(party.id, e)} isTextarea={true} placeholder="उत्तर- राम, दक्षिण- रास्ता..." />
          </div>
        ))}

        <button onClick={addParty} className="w-full bg-green-100 text-green-700 border border-green-300 py-2 px-4 rounded hover:bg-green-200 mb-6 font-medium transition-colors">
          + एक और हिस्सेदार (भाई) जोड़ें
        </button>

        <div className="bg-yellow-50 p-3 rounded mb-6 border border-yellow-100">
           <HindiInput label="अन्य विशेष शर्तें (यदि कोई हो)" name="customConditions" value={commonData.customConditions} onChange={handleCommonChange} isTextarea={true} placeholder="कुएं या रास्ते के उपयोग के बारे में..." />
        </div>

        <div className="flex flex-col gap-3 sticky bottom-0 bg-white pt-2 border-t">
          <button onClick={downloadPDF} className="w-full bg-red-600 text-white py-3 px-4 rounded font-bold hover:bg-red-700 shadow-md transition-colors">
            PDF डाउनलोड करें
          </button>
          <button onClick={downloadWord} className="w-full bg-blue-600 text-white py-3 px-4 rounded font-bold hover:bg-blue-700 shadow-md transition-colors">
            Word (.doc) फाइल डाउनलोड करें
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: Live Document Preview */}
      <div className="w-full md:w-2/3 bg-white p-8 md:p-12 shadow-lg rounded overflow-y-auto border border-gray-300 h-[85vh]">
        <div id="panchnama-document" className="text-black font-sans leading-relaxed" style={{ fontSize: '16px', color: '#000', fontFamily: "Arial, sans-serif" }}>
          
          <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '25px' }}>
            आपसी सहमति से पारिवारिक भूमि बंटवारा पंचनामा
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <p><strong>दिनांक:</strong> {commonData.date || '...................'}</p>
            <p><strong>स्थान:</strong> {commonData.place || '...................'}</p>
          </div>

          <p style={{ marginBottom: '15px', textAlign: 'justify' }}>
            आज दिनांक <strong>{commonData.date || '...................'}</strong> को हम निम्नलिखित पक्षकार पूरे होश-ओ-हवास में, बिना किसी जोर-दबाव या नशे के, अपनी स्वेच्छा से यह पारिवारिक बंटवारा पंचनामा लिख रहे हैं:
          </p>

          {/* Dynamic Parties Preview Intro */}
          <div style={{ marginBottom: '20px' }}>
            {parties.map((party) => (
              <p key={`intro-${party.id}`} style={{ marginBottom: '8px' }}>
                <strong>{party.title} पक्ष:</strong> श्री {party.name || '...................'}, उम्र- {party.age || '......'} वर्ष, निवासी- ग्राम {commonData.village || '...................'}, थाना {commonData.anchal || '...................'}, जिला {commonData.district || '...................'}।
              </p>
            ))}
          </div>

          <h3 style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '18px' }}>बंटवारे की पृष्ठभूमि और शर्तें:</h3>
          <ol style={{ paddingLeft: '20px', marginBottom: '25px', textAlign: 'justify' }}>
            <li style={{ marginBottom: '8px' }}><strong>संपत्ति का विवरण:</strong> हम सभी पक्षकार आपस में सगे संबंधी हैं। हमारे पूर्वज स्व. <strong>{commonData.moolRaiyat || '...................'}</strong> के नाम से ग्राम {commonData.village || '...........'}, थाना नंबर {commonData.thanaNo || '...........'}, अंचल {commonData.anchal || '...........'}, जिला {commonData.district || '...........'} में पैतृक भूमि स्थित है।</li>
            <li style={{ marginBottom: '8px' }}><strong>बंटवारे का कारण:</strong> अपनी-अपनी सुविधा, शांतिपूर्ण उपभोग और वर्तमान बिहार भूमि सर्वेक्षण (Land Survey) तथा दाखिल-खारिज के कार्यों के लिए हम सभी पक्षकार अपनी आपसी सहमति से उक्त पैतृक संपत्ति का बंटवारा कर रहे हैं।</li>
            <li style={{ marginBottom: '8px' }}><strong>स्वामित्व और अधिकार:</strong> इस पंचनामे के लागू होने के बाद, जो संपत्ति जिस पक्ष के हिस्से में आई है, वह उस पर पूर्ण रूप से अपना मालिकाना हक रखेगा।</li>
            <li style={{ marginBottom: '8px' }}><strong>सरकारी प्रक्रिया:</strong> सभी पक्ष इस पंचनामे के आधार पर अपने-अपने हिस्से की संपत्ति का अंचल कार्यालय में म्यूटेशन कराने और नई जमाबंदी कायम कराने के लिए स्वतंत्र हैं।</li>
            {commonData.customConditions && (
              <li style={{ marginBottom: '8px' }}><strong>विशेष शर्तें:</strong> {commonData.customConditions}</li>
            )}
          </ol>

          <h3 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '18px' }}>संपत्ति के बंटवारे का विवरण:</h3>
          
          {/* Dynamic Parties Details Preview */}
          {parties.map((party) => (
            <div key={`details-${party.id}`} style={{ marginBottom: '15px', padding: '12px', border: '1px solid #999', borderRadius: '4px' }}>
              <p style={{ marginBottom: '5px' }}><strong>{party.title} पक्ष ({party.name || '...................'}) के हिस्से में आई संपत्ति:</strong></p>
              <p style={{ marginBottom: '5px' }}><strong>खाता नं.:</strong> {party.khata || '......'} | <strong>खेसरा नं.:</strong> {party.khesra || '......'} | <strong>रकबा:</strong> {party.rakba || '......'}</p>
              <p><strong>चौहद्दी:</strong> {party.boundaries || 'उत्तर- ........., दक्षिण- ........., पूरब- ........., पश्चिम- .........'}</p>
            </div>
          ))}

          <p style={{ marginTop: '25px', marginBottom: '40px', textAlign: 'justify' }}>
            अतः यह आपसी सहमति बंटवारा पंचनामा हमने अपनी राजी-खुशी से, गवाहों (पंचों) के समक्ष पढ़-सुनकर और अच्छी तरह समझकर लिख दिया है ताकि सनद रहे और वक़्त पर काम आवे।
          </p>

          {/* Dynamic Signature Section */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '50px', justifyContent: 'space-between' }}>
            {parties.map((party) => (
               <div key={`sig-${party.id}`} style={{ minWidth: '150px', marginBottom: '20px' }}>
                 <p style={{ borderBottom: '1px solid #000', width: '100%', marginBottom: '5px' }}></p>
                 <p style={{ textAlign: 'center' }}><strong>हस्ताक्षर {party.title} पक्ष</strong></p>
               </div>
            ))}
          </div>

          <div style={{ marginTop: '50px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '16px' }}>गवाहों (पंचों) के हस्ताक्षर:</p>
            <p style={{ marginBottom: '35px' }}>1. हस्ताक्षर: _________________ (नाम: ......................................., पता: .......................................)</p>
            <p>2. हस्ताक्षर: _________________ (नाम: ......................................., पता: .......................................)</p>
          </div>

        </div>
      </div>
    </div>
  );
}