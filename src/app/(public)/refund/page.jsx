export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto border border-red-100 shadow-sm rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-6">रिफंड और रद्दीकरण (Refund & Cancellation)</h1>
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="font-bold text-lg text-gray-800 mb-2">1. रिफंड पॉलिसी (Refund Policy)</h2>
            <p>
              चूंकि हमारी सेवा डिजिटल PDF (Digital Product) प्रदान करती है, एक बार पेमेंट सफल होने और PDF जेनरेट होने के बाद कोई भी 
              <strong> रिफंड (Refund) नहीं दिया जाएगा</strong>।
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg text-gray-800 mb-2">2. विफल भुगतान (Failed Transactions)</h2>
            <p>
              यदि आपके बैंक से पैसे कट गए हैं लेकिन आपको PDF प्राप्त नहीं हुई, तो कृपया घबराएं नहीं। 
              अपने पेमेंट का स्क्रीनशॉट हमें 24 घंटे के भीतर ईमेल करें। वेरिफिकेशन के बाद हम आपको मैन्युअल रूप से PDF भेज देंगे।
            </p>
          </section>

          <section className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
            <h2 className="font-bold text-sm uppercase text-red-700 mb-1">कृपया ध्यान दें:</h2>
            <p className="text-sm">किसी भी गलत जानकारी (Wrong Data) के कारण पीडीएफ गलत होने पर रिफंड स्वीकार्य नहीं होगा।</p>
          </section>
        </div>
      </div>
    </div>
  );
}