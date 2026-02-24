// 1. Corrected Import: Usually, you import from a components folder, 
// but if it's a page component, ensure the path is correct.
import Feedback from "../feedback/page"; 

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        
        {/* Mixed Language Heading */}
        <h1 className="text-3xl font-bold text-blue-700 mb-6 border-b-4 border-blue-100 inline-block pb-2">
          संपर्क करें (Contact Us)
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          यदि आपको वेबसाइट या पेमेंट से जुड़ी कोई समस्या है, तो कृपया हमसे संपर्क करें। <br/>
          (We value your feedback and are here to help you with any technical issues.)
        </p>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            
            {/* Email Support */}
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                <span className="font-bold">@</span>
              </div>
              <div>
                <h3 className="font-bold text-blue-800">Email Support</h3>
                <p className="text-gray-600">viktechzweb@gmail.com</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                <span className="font-bold text-lg">📍</span>
              </div>
              <div>
                <h3 className="font-bold text-blue-800">स्थान (Location)</h3>
                <p className="text-gray-600 text-sm">Vaishali, Bihar, India</p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                <span className="font-bold text-lg">⏰</span>
              </div>
              <div>
                <h3 className="font-bold text-blue-800">कार्य समय (Hours)</h3>
                <p className="text-gray-600 text-sm">Mon - Sat (10:00 AM – 6:00 PM)</p>
              </div>
            </div>

          </div>
          
          {/* Feedback Component Column */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <h3 className="text-lg font-bold mb-4 text-center text-slate-700">
               हमे फीडबैक भेजें (Send Feedback)
             </h3>
             <Feedback />
          </div>

        </div>
      </div>
    </div>
  );
}