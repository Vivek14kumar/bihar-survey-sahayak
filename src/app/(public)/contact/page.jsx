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
            
            {/* WhatsApp Support */}
<a 
  href="https://wa.me/918676880507" 
  target="_blank" 
  rel="noopener noreferrer"
  className="flex items-start space-x-4 hover:bg-green-50 p-3 rounded-xl transition"
>
  <div className="bg-green-500 p-2 rounded-xl text-white">
    {/* WhatsApp SVG Icon */}
    <svg 
      className="w-6 h-6 fill-current" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  </div>

  <div>
    <h3 className="font-bold text-blue-800">WhatsApp Support</h3>
    <p className="text-gray-600">8676880507</p>
  </div>
</a>

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