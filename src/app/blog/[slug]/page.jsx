import Link from "next/link";
import CompactQuickLinks from "@/components/QuickLinksFooter";
import {
  FileText,
  FolderCheck,
  AlertTriangle,
  PenLine,
  Files,
  CheckCircle
} from "lucide-react";

export default async function BlogPost({ params }) {

  const { slug } = await params;

  const posts = {

    "prapatra-2-kaise-bhare": {
      title: "बिहार सर्वे प्रपत्र-2 कैसे भरें (Step-by-Step Guide)",
      intro:
        "प्रपत्र-2 बिहार भूमि सर्वे का सबसे महत्वपूर्ण फॉर्म है। इसमें जमीन मालिक अपनी जमीन और अधिकार की जानकारी देता है। यदि यह फॉर्म गलत भर दिया गया तो भविष्य में जमीन रिकॉर्ड में समस्या हो सकती है।",

      sections: [

        {
          icon: FileText,
          heading: "प्रपत्र-2 क्या होता है?",
          content:
            "प्रपत्र-2 एक Self Declaration Form है जिसमें जमीन मालिक अपनी जमीन का विवरण देता है। यह फॉर्म सर्वे रिकॉर्ड अपडेट करने के लिए जरूरी होता है।"
        },

        {
          icon: FolderCheck,
          heading: "प्रपत्र-2 भरने के लिए जरूरी दस्तावेज",
          list: [
            "आधार कार्ड",
            "जमीन की रसीद (लगान रसीद)",
            "खाता संख्या",
            "खेसरा संख्या",
            "मोबाइल नंबर"
          ]
        },

        {
          icon: CheckCircle,
          heading: "प्रपत्र-2 भरने की प्रक्रिया",
          steps: [
            "सबसे पहले जिला, अंचल और मौजा की जानकारी भरें",
            "जमीन का खाता और खेसरा नंबर लिखें",
            "जमीन मालिक का नाम और पिता/पति का नाम लिखें",
            "जमीन का प्रकार और अधिकार लिखें",
            "अंत में घोषणा करके हस्ताक्षर करें"
          ]
        }

      ],

      tool: {
        text: "प्रपत्र-2 Online Generate करें",
        link: "/prapatra-2"
      }
    },



    "bihar-survey-vanshavali-kaise-banaye": {
      title: "बिहार सर्वे वंशावली कैसे बनाएं",
      intro:
        "वंशावली (Family Tree) बिहार भूमि सर्वे में बहुत जरूरी दस्तावेज है। इससे यह साबित होता है कि जमीन परिवार के किस सदस्य की है।",

      sections: [

        {
          icon: FileText,
          heading: "वंशावली क्या है?",
          content:
            "वंशावली एक पारिवारिक चार्ट होता है जिसमें परिवार के सदस्यों का संबंध दिखाया जाता है।"
        },

        {
          icon: FolderCheck,
          heading: "वंशावली कब जरूरी होती है",
          list: [
            "विरासत से जमीन मिली हो",
            "परिवार में बंटवारा हुआ हो",
            "सर्वे रिकॉर्ड में परिवार का नाम जोड़ना हो"
          ]
        },

        {
          icon: CheckCircle,
          heading: "वंशावली कैसे बनाएं",
          steps: [
            "परिवार के सबसे पुराने सदस्य का नाम लिखें",
            "उनके पुत्र / पुत्री का नाम जोड़ें",
            "हर पीढ़ी को सही संबंध के साथ दिखाएं",
            "सभी सदस्यों का नाम और संबंध सही लिखें"
          ]
        }

      ],

      tool: {
        text: "वंशावली Online Generate करें",
        link: "/#tool"
      }
    },



    "bihar-survey-objection-application": {
      title: "बिहार सर्वे आपत्ति आवेदन कैसे करें",
      intro:
        "अगर सर्वे के दौरान जमीन रिकॉर्ड में गलती हो जाती है तो आप आपत्ति आवेदन देकर उसे सुधार सकते हैं।",

      sections: [

        {
          icon: AlertTriangle,
          heading: "आपत्ति कब करनी चाहिए",
          list: [
            "जमीन मालिक का नाम गलत दर्ज हो",
            "खेसरा नंबर गलत हो",
            "जमीन का क्षेत्र गलत दर्ज हो"
          ]
        },

        {
          icon: Files,
          heading: "आवेदन में क्या लिखें",
          list: [
            "आवेदक का नाम",
            "जमीन का विवरण",
            "गलती का विवरण",
            "सही जानकारी"
          ]
        }

      ],

      tool: {
        text: "आपत्ति आवेदन Generate करें",
        link: "/objection-letter"
      }
    },



    "bihar-survey-parimarjan-process": {
      title: "बिहार सर्वे परिमार्जन प्रक्रिया",
      intro:
        "सर्वे रिकॉर्ड में गलती सुधारने की प्रक्रिया को परिमार्जन कहा जाता है।",

      sections: [

        {
          icon: AlertTriangle,
          heading: "परिमार्जन कब करना चाहिए",
          list: [
            "नाम गलत हो",
            "जमीन का क्षेत्र गलत हो",
            "परिवार की जानकारी गलत हो"
          ]
        },

        {
          icon: FolderCheck,
          heading: "जरूरी दस्तावेज",
          list: [
            "आधार कार्ड",
            "जमीन के कागजात",
            "खाता और खेसरा नंबर",
            "आवेदन पत्र"
          ]
        }

      ],

      tool: {
        text: "परिमार्जन सहायता लें",
        link: "/parimarjan-help"
      }
    },



    "bihar-survey-required-documents": {
      title: "बिहार सर्वे में कौन-कौन से दस्तावेज चाहिए",
      intro:
        "बिहार भूमि सर्वे के दौरान कई महत्वपूर्ण दस्तावेजों की जरूरत होती है।",

      sections: [

        {
          icon: Files,
          heading: "जरूरी दस्तावेज",
          list: [
            "आधार कार्ड",
            "जमीन की रसीद",
            "खाता संख्या",
            "खेसरा संख्या",
            "वंशावली",
            "प्रपत्र-2"
          ]
        },

        {
          icon: PenLine,
          heading: "अतिरिक्त दस्तावेज",
          list: [
            "बंटवारा आवेदन",
            "शपथ पत्र",
            "आपत्ति आवेदन"
          ]
        }

      ],

      tool: {
        text: "सभी सर्वे फॉर्म देखें",
        link: "/forms"
      }
    },

    "bihar-jamin-batwara-application": {
  title: "बिहार जमीन बंटवारा आवेदन कैसे करें",
  intro:
    "अगर किसी जमीन पर कई लोगों का अधिकार है और परिवार के सदस्य अलग-अलग हिस्से में जमीन बांटना चाहते हैं तो बंटवारा आवेदन करना पड़ता है। बिहार सर्वे के दौरान यह आवेदन बहुत महत्वपूर्ण होता है।",

  sections: [

    {
      icon: FileText,
      heading: "बंटवारा आवेदन क्या होता है",
      content:
        "बंटवारा आवेदन वह आवेदन होता है जिसमें परिवार के सदस्य अपनी साझा जमीन को अलग-अलग हिस्सों में बांटने का अनुरोध करते हैं।"
    },

    {
      icon: FolderCheck,
      heading: "बंटवारा आवेदन के लिए जरूरी दस्तावेज",
      list: [
        "आधार कार्ड",
        "जमीन की रसीद",
        "खाता संख्या",
        "खेसरा संख्या",
        "वंशावली"
      ]
    },

    {
      icon: CheckCircle,
      heading: "बंटवारा आवेदन कैसे करें",
      steps: [
        "सभी जमीन मालिकों की जानकारी लिखें",
        "जमीन का खाता और खेसरा नंबर भरें",
        "किस सदस्य को कितना हिस्सा मिलेगा यह लिखें",
        "आवेदन पर सभी सदस्यों का हस्ताक्षर कराएं"
      ]
    }

  ],

  tool: {
    text: "बंटवारा आवेदन Online Generate करें",
    link: "/batwara-application-bihar"
  }
},

"jamabandi-cancellation-application": {
  title: "जमाबंदी रद्द करने का आवेदन कैसे करें",
  intro:
    "अगर जमीन की जमाबंदी गलत तरीके से किसी और के नाम पर दर्ज हो गई है तो उसे रद्द करने के लिए आवेदन किया जा सकता है।",

  sections: [

    {
      icon: AlertTriangle,
      heading: "जमाबंदी रद्द कब करनी चाहिए",
      list: [
        "जमीन गलत व्यक्ति के नाम दर्ज हो",
        "जमीन फर्जी तरीके से ट्रांसफर हो गई हो",
        "रिकॉर्ड में गलती हो"
      ]
    },

    {
      icon: FolderCheck,
      heading: "जरूरी दस्तावेज",
      list: [
        "आधार कार्ड",
        "जमीन के पुराने कागजात",
        "खाता और खेसरा नंबर",
        "आवेदन पत्र"
      ]
    },

    {
      icon: CheckCircle,
      heading: "आवेदन प्रक्रिया",
      steps: [
        "गलत जमाबंदी की जानकारी लिखें",
        "सही जमीन मालिक का विवरण दें",
        "संबंधित दस्तावेज संलग्न करें",
        "अंचल कार्यालय में आवेदन जमा करें"
      ]
    }

  ],

  tool: {
    text: "जमाबंदी रद्द आवेदन बनाएं",
    link: "/cancellation-jamabandhi"
  }
},


"bihar-survey-shapath-patra": {
  title: "बिहार सर्वे शपथ पत्र कैसे बनाएं",
  intro:
    "बिहार भूमि सर्वे के दौरान कई बार जमीन मालिक को शपथ पत्र देना पड़ता है जिसमें वह जमीन की जानकारी की पुष्टि करता है।",

  sections: [

    {
      icon: FileText,
      heading: "शपथ पत्र क्या होता है",
      content:
        "शपथ पत्र एक कानूनी दस्तावेज होता है जिसमें व्यक्ति अपनी जानकारी को सही होने की शपथ लेता है।"
    },

    {
      icon: FolderCheck,
      heading: "शपथ पत्र कब जरूरी होता है",
      list: [
        "जमीन मालिक की पुष्टि के लिए",
        "रिकॉर्ड सुधार के लिए",
        "आपत्ति आवेदन के समय"
      ]
    },

    {
      icon: CheckCircle,
      heading: "शपथ पत्र कैसे बनाएं",
      steps: [
        "आवेदक का नाम और पता लिखें",
        "जमीन का विवरण लिखें",
        "घोषणा लिखें कि जानकारी सही है",
        "नोटरी या मजिस्ट्रेट से सत्यापन कराएं"
      ]
    }

  ],

  tool: {
    text: "शपथ पत्र Online Generate करें",
    link: "/shapath-patra"
  }
},


"bihar-survey-status-check": {
  title: "बिहार सर्वे स्टेटस कैसे देखें",
  intro:
    "अगर आपने बिहार सर्वे से संबंधित कोई आवेदन किया है तो आप उसका स्टेटस भी ऑनलाइन देख सकते हैं।",

  sections: [

    {
      icon: FileText,
      heading: "सर्वे स्टेटस क्या होता है",
      content:
        "सर्वे स्टेटस से यह पता चलता है कि आपका आवेदन अभी किस प्रक्रिया में है।"
    },

    {
      icon: CheckCircle,
      heading: "स्टेटस कैसे देखें",
      steps: [
        "सर्वे पोर्टल खोलें",
        "जिला और अंचल चुनें",
        "आवेदन नंबर डालें",
        "स्टेटस देखें"
      ]
    }

  ],

  tool: {
    text: "सभी सर्वे फॉर्म देखें",
    link: "/forms"
  }
},

"bihar-co-karmchari-hartal": {
  title: "बिहार में CO और कर्मचारी हड़ताल: जमीन सर्वे और आवेदन पर क्या असर होगा",
  intro:
    "कभी-कभी बिहार में अंचल कार्यालय (CO Office) के कर्मचारी और राजस्व कर्मचारी अपनी मांगों को लेकर हड़ताल पर चले जाते हैं। इसका असर जमीन सर्वे, आवेदन और रिकॉर्ड सुधार की प्रक्रिया पर पड़ सकता है।",

  sections: [

    {
      icon: FileText,
      heading: "CO और कर्मचारी हड़ताल क्या होती है",
      content:
        "जब अंचल कार्यालय के कर्मचारी अपनी मांगों को लेकर काम बंद कर देते हैं तो इसे हड़ताल कहा जाता है। इस दौरान जमीन से जुड़े कई सरकारी काम रुक सकते हैं।"
    },

    {
      icon: AlertTriangle,
      heading: "हड़ताल से कौन-कौन से काम प्रभावित होते हैं",
      list: [
        "जमीन सर्वे से जुड़े आवेदन",
        "परिमार्जन प्रक्रिया",
        "जमाबंदी से संबंधित कार्य",
        "आपत्ति आवेदन की सुनवाई"
      ]
    },

    {
      icon: FolderCheck,
      heading: "हड़ताल के दौरान क्या करें",
      list: [
        "अपने सभी दस्तावेज तैयार रखें",
        "ऑनलाइन फॉर्म पहले से बना लें",
        "आवेदन जमा करने के लिए हड़ताल खत्म होने का इंतजार करें"
      ]
    },

    {
      icon: CheckCircle,
      heading: "ऑनलाइन टूल का उपयोग क्यों करें",
      content:
        "अगर आप पहले से अपने आवेदन और दस्तावेज तैयार कर लेते हैं तो हड़ताल खत्म होते ही आप तुरंत आवेदन जमा कर सकते हैं। इससे आपका समय बचता है।"
    }

  ],

  tool: {
    text: "सभी बिहार सर्वे फॉर्म बनाएं",
    link: "/forms"
  }
},

  };

  const post = posts[slug];

  if (!post) {
    return <div className="p-10 text-center">Article not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-14">

      <h1 className="text-4xl font-bold mb-6 text-slate-800">
        {post.title}
      </h1>

      <p className="text-lg text-slate-600 mb-10 leading-relaxed">
        {post.intro}
      </p>

      {post.sections.map((section, i) => {

        const Icon = section.icon;

        return (
          <div key={i} className="mb-10">

            <div className="flex items-center gap-3 mb-4">
              <Icon className="text-blue-600" size={24} />
              <h2 className="text-2xl font-semibold">
                {section.heading}
              </h2>
            </div>

            {section.content && (
              <p className="text-slate-600 mb-4">
                {section.content}
              </p>
            )}

            {section.list && (
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                {section.list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}

            {section.steps && (
              <ol className="list-decimal pl-6 space-y-2 text-slate-600">
                {section.steps.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            )}

          </div>
        );
      })}

      {/* TOOL CTA */}

      <div className="mt-14 bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">

        <h3 className="text-2xl font-semibold mb-4">
          Online Tool
        </h3>

        <Link
          href={post.tool.link}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {post.tool.text}
        </Link>

      </div>

      {/* OTHER TOOLS */}

      <div className="mt-12 border-t pt-8">

        <h3 className="text-xl font-semibold mb-5">
          अन्य उपयोगी टूल
        </h3>

        <div className="flex flex-wrap gap-3">

          <Link href="/batwara-application-bihar" className="bg-gray-100 px-4 py-2 rounded-lg">
            बंटवारा आवेदन
          </Link>

          <Link href="/shapath-patra" className="bg-gray-100 px-4 py-2 rounded-lg">
            शपथ पत्र
          </Link>

          <Link href="/pdf-toolkit" className="bg-gray-100 px-4 py-2 rounded-lg">
            PDF Toolkit
          </Link>

        </div>

      </div>
      <div className="mt-4">
        <CompactQuickLinks/>
      </div>
    </div>
  );
}