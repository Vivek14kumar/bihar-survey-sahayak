import Navbar from "@/components/Navbar";
import MobilePopup from "@/components/MobilePopup";
import SubscribePopup from "@/components/SubscribePopup";
import Link from "next/link";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen ">
        {children}
        {/* <MobilePopup /> */} 
        <SubscribePopup />
      </main>

      <footer className="bg-slate-900 text-slate-300 ">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
          <div>
            <h4 className="font-semibold text-white mb-4">About Platform</h4>
            <p className="text-sm leading-relaxed text-slate-400">
              Bihar Survey Sahayak is a private citizen assistance platform
              designed to help users prepare Vanshavali documents for Bihar
              Land Survey 2026 in official-ready PDF format.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Important Notice</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Not a Government Website</li>
              <li>No data stored on servers</li>
              <li>Works entirely on your device</li>
              <li>Verify details at official survey camps</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link></li>
              <li><Link href="/feedback" className="hover:text-white transition">Feedback</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/refund" className="hover:text-white transition">Refund</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 text-center text-xs text-slate-500 py-6">
          © {new Date().getFullYear()} Bihar Survey Sahayak — Private Technical Tool  <br></br>
          <span className="block sm:inline">
            Designed &amp; Maintained by{" "}
            <a href="mailto:viktechzweb@gmail.com" className="text-blue-500 hover:text-blue-600 font-semibold" aria-label="Email VIKTECHZ">
              VIK-TECHZ
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}