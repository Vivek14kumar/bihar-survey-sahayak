// src/app/(admin)/admin/ledger/page.jsx
import dbConnect from "../../../api/utils/dbConnect";
import Document from "../../../api/models/Document";
import User from "../../../api/models/User"; // Required to register the schema for populate()
import LedgerClient from "./LedgerClient";

// Force dynamic rendering so the ledger is always up-to-date
export const dynamic = "force-dynamic";

async function getLedgerData() {
  await dbConnect();
  
  // Fetch documents, populate operator details, and sort newest first
  const docs = await Document.find()
    .populate("user", "shopName ownerName mobileNumber")
    .sort({ date: -1 })
    .lean();

  // Next.js requires plain objects to be passed to Client Components
  return docs.map((doc) => ({
    _id: doc._id.toString(),
    ref: doc.ref,
    txnId: doc.txnId,
    title: doc.title,
    clientName: doc.clientName,
    clientMobile: doc.clientMobile,
    cost: doc.cost,
    status: doc.status || "PAID",
    date: doc.date ? doc.date.toISOString() : new Date().toISOString(),
    operator: doc.user ? {
      shopName: doc.user.shopName,
      ownerName: doc.user.ownerName,
      mobileNumber: doc.user.mobileNumber,
    } : { shopName: "Unknown", ownerName: "N/A" }
  }));
}

export default async function LedgerPage() {
  const documents = await getLedgerData();

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Document Ledger</h1>
        <p className="text-slate-500 text-sm mt-1">Audit transactions, track form generations, and issue refunds.</p>
      </div>

      {/* Render the interactive client component */}
      <LedgerClient initialDocuments={documents} />
    </div>
  );
}