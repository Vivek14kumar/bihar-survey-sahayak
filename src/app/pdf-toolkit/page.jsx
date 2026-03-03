"use client";
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import imageCompression from 'browser-image-compression';
import { 
  Upload, CheckCircle, Loader2, FileText, Receipt, 
  ScrollText, Download, CreditCard, Copy, UserCircle, 
  Plus, X, FileSearch, AlertCircle, MapPin, ShieldCheck 
} from 'lucide-react';
import QuickLinksFooter from '@/components/QuickLinksFooter';

export default function SmartPDFToolkit() {
  const [selectedIssue, setSelectedIssue] = useState("raiyat");
  const [files, setFiles] = useState({}); // Stores arrays: { affidavit: [File], khatiyan: [File, File] }
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Configuration for dynamic slots based on the problem
  const issueConfig = {
    raiyat: {
      title: "रैयत/पिता का नाम सुधार",
      slots: [
        { id: 'affidavit', label: '1. शपथ पत्र (Mandatory)', icon: <FileText className="text-indigo-600" /> },
        { id: 'shuddhi', label: '2. शुद्धि पत्र (Correction Slip)', icon: <Copy className="text-blue-600" /> },
        { id: 'jamabandi', label: '3. जमाबंदी पंजी कॉपी', icon: <ScrollText className="text-amber-600" /> },
        { id: 'aadhaar', label: '4. आधार कार्ड', icon: <CreditCard className="text-rose-600" /> },
        { id: 'receipt', label: '5. लगान रसीद', icon: <Receipt className="text-emerald-600" /> },
      ]
    },
    caste_address: {
      title: "जाति/पता सुधार",
      slots: [
        { id: 'affidavit', label: '1. शपथ पत्र (Mandatory)', icon: <FileText className="text-indigo-600" /> },
        { id: 'caste_cert', label: '2. जाति प्रमाण पत्र', icon: <ShieldCheck className="text-purple-600" /> },
        { id: 'id_proof', label: '3. आधार / वोटर ID', icon: <CreditCard className="text-rose-600" /> },
        { id: 'address_doc', label: '4. बिजली बिल / राशन कार्ड', icon: <Receipt className="text-blue-600" /> },
        { id: 'residence_cert', label: '5. निवास प्रमाण पत्र', icon: <MapPin className="text-orange-600" /> },
      ]
    },
    land: {
      title: "खाता/खेसरा/रकबा सुधार",
      slots: [
        { id: 'affidavit', label: '1. शपथ पत्र (Mandatory)', icon: <FileText className="text-indigo-600" /> },
        { id: 'khatiyan', label: '2. खतियान (Khatiyan)', icon: <ScrollText className="text-amber-600" /> },
        { id: 'order', label: '3. दाखिल-खारिज आदेश', icon: <CheckCircle className="text-emerald-600" /> },
        { id: 'lpc', label: '4. भू-दखल प्रमाणपत्र (LPC)', icon: <UserCircle className="text-orange-600" /> },
      ]
    },
    lagan: {
      title: "लगान (Lagan) सुधार",
      slots: [
        { id: 'affidavit', label: '1. शपथ पत्र (Mandatory)', icon: <FileText className="text-indigo-600" /> },
        { id: 'old_receipt', label: '2. पिछली लगान रसीद', icon: <Receipt className="text-amber-600" /> },
        { id: 'shuddhi', label: '3. शुद्धि पत्र', icon: <Copy className="text-blue-600" /> },
      ]
    }
  };

  const handleFileChange = (slotId, e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(prev => ({
        ...prev,
        [slotId]: prev[slotId] ? [...prev[slotId], ...selectedFiles] : [...selectedFiles]
      }));
      setDownloadUrl(null);
    }
  };

  const removeFile = (slotId, index) => {
    setFiles(prev => {
      const updatedList = [...prev[slotId]];
      updatedList.splice(index, 1);
      return { 
        ...prev, 
        [slotId]: updatedList.length > 0 ? updatedList : null 
      };
    });
    setDownloadUrl(null);
  };

  // RESET FUNCTION
  const resetToolkit = () => {
    setFiles({});
    setDownloadUrl(null);
    setIsProcessing(false);
  };

  const generatePDF = async () => {
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      const currentSlots = issueConfig[selectedIssue].slots;

      for (const slot of currentSlots) {
        const slotFiles = files[slot.id];
        if (!slotFiles) continue;

        for (const file of slotFiles) {
          if (file.type === 'application/pdf') {
            // MERGE EXISTING PDF PAGES
            const existingPdfBytes = await file.arrayBuffer();
            const existingPdf = await PDFDocument.load(existingPdfBytes);
            const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          } else {
            // COMPRESS AND EMBED IMAGES
            const options = { maxSizeMB: 0.15, maxWidthOrHeight: 1200 };
            const compressedFile = await imageCompression(file, options);
            const imageBytes = await compressedFile.arrayBuffer();
            
            const image = file.type === 'image/png' 
              ? await mergedPdf.embedPng(imageBytes) 
              : await mergedPdf.embedJpg(imageBytes);

            const page = mergedPdf.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
          }
        }
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      if (blob.size > 1024 * 1024) {
        alert("सावधानी: फाइल 1MB से बड़ी है। कृपया कुछ फोटो हटाएं या कम पन्ने जोड़ें।");
      }

      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert("PDF बनाने में त्रुटि हुई। कृपया फाइल फॉर्मेट चेक करें।");
    }
    setIsProcessing(false);
  };

  return (
    <>
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center mb-10">
      <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
        बिहार भूमि सर्वे <span className="text-indigo-600">1MB PDF टूलकिट</span>
      </h2>
      <p className="text-slate-500 mt-3 font-medium max-w-2xl mx-auto text-sm md:text-base">
        अपने खतियान, रसीद और शपथ पत्र को एक साथ जोड़ें और सरकारी पोर्टल के लिए 
        <span className="text-indigo-600 font-bold"> 1MB से छोटी PDF </span> तैयार करें।
      </p>
    </div>
      {/* 1. ISSUE SELECTION PILLS */}
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.keys(issueConfig).map((key) => (
          <button
            key={key}
            onClick={() => { setSelectedIssue(key); setFiles({}); setDownloadUrl(null); }}
            className={`px-6 py-3 rounded-full font-black text-xs md:text-sm transition-all border-2 ${
              selectedIssue === key 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-105' 
              : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
            }`}
          >
            {issueConfig[key].title}
          </button>
        ))}
      </div>

      {/* 2. MAIN TOOLKIT INTERFACE */}
      <div className="bg-white rounded-[3rem] shadow-2xl p-6 md:p-12 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-50 pb-10">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg">
              <Upload className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">दस्तावेज़ अपलोड केंद्र</h3>
              <p className="text-slate-400 text-sm mt-1 font-bold">1MB के भीतर PDF तैयार करें</p>
            </div>
          </div>
          {files.affidavit && (
            <div className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border border-emerald-100 animate-bounce">
              <CheckCircle size={18} /> शपथ पत्र तैयार है
            </div>
          )}
        </div>

        {/* 3. DYNAMIC MULTI-FILE SLOTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {issueConfig[selectedIssue].slots.map((slot) => (
            <div 
              key={slot.id} 
              className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all ${
                files[slot.id] ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-50 bg-slate-50/50 hover:border-indigo-100'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-xl shadow-sm ring-1 ring-slate-100">
                    {slot.icon}
                  </div>
                  <span className="font-extrabold text-slate-700 text-sm md:text-base leading-tight">
                    {slot.label}
                  </span>
                </div>
                <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl shadow-lg transition-transform active:scale-90">
                  <Plus size={20} />
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    accept="image/*,application/pdf" 
                    onChange={(e) => handleFileChange(slot.id, e)} 
                  />
                </label>
              </div>

              {/* FILE PREVIEW CHIPS */}
              {files[slot.id] && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {files[slot.id].map((file, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm animate-in zoom-in">
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">{file.name}</span>
                      <button onClick={() => removeFile(slot.id, idx)} className="text-rose-500 hover:text-rose-700 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 4. REJECTION PREVENTION TIP */}
        <div className="bg-amber-50 border-l-8 border-amber-400 p-6 rounded-2xl mb-10">
          <div className="flex gap-4 items-start">
            <AlertCircle className="text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-black text-amber-900">अमीन (Amin) की सलाह:</p>
              <p className="text-xs text-amber-800 font-bold leading-relaxed mt-1">
                सबसे पहले 'शपथ पत्र' अपलोड करें, फिर 'रसीद', और अंत में 'खतियान/केवाला'। 
                हम इसी क्रम में आपकी PDF बनाएंगे।
              </p>
            </div>
          </div>
        </div>

        {/* 5. GENERATE & DOWNLOAD */}
        <div className="space-y-4">
          <button 
            onClick={generatePDF}
            disabled={!files.affidavit || isProcessing}
            className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all ${
              files.affidavit 
              ? 'bg-slate-900 text-white shadow-2xl hover:bg-black hover:-translate-y-1' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <><FileSearch /> Final PDF तैयार करें</>}
          </button>

          {downloadUrl && (
            <div className="animate-in slide-in-from-bottom-5">
              <a 
                href={downloadUrl} 
                download="Bihar_Survey_Sahayak.pdf" 
                onClick={resetToolkit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl"
              >
                डाउनलोड करें <Download />
              </a>
              <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">फाइल सफलतापूर्वक तैयार कर ली गई है</p>
            </div>
          )}
        </div>
      </div>
    </div>
    <div>
        <QuickLinksFooter/>
    </div>
    </>
  );
}