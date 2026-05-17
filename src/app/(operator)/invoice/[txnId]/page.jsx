"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// ==========================================
// 1. React-PDF Styles (Mapping Tailwind to PDFKit)
// ==========================================
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", color: "#1e293b", backgroundColor: "#ffffff" },
  header: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 2, borderBottomColor: "#f1f5f9", paddingBottom: 20, marginBottom: 20 },
  brandSection: { flexDirection: "column" },
  brandTitle: { fontSize: 20, fontWeight: "extrabold", marginBottom: 4 },
  brandText: { fontSize: 10, color: "#64748b", marginBottom: 2 },
  invoiceSection: { alignItems: "flex-end" },
  invoiceTitle: { fontSize: 24, fontWeight: "black", color: "#cbd5e1", textTransform: "uppercase", marginBottom: 8 },
  invoiceDetail: { fontSize: 10, fontWeight: "bold", marginBottom: 4 },
  invoiceDetailLight: { fontWeight: "normal", color: "#475569" },
  statusBadge: { backgroundColor: "#ecfdf5", color: "#047857", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, fontSize: 10, marginTop: 4 },
  
  billedToLabel: { fontSize: 9, fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 },
  billedToName: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  billedToText: { fontSize: 10, color: "#475569", marginBottom: 2 },
  
  table: { width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4, marginBottom: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f8fafc", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", padding: 8 },
  tableHeaderCellDesc: { width: "66%", fontSize: 9, fontWeight: "bold", color: "#475569", textTransform: "uppercase" },
  tableHeaderCellQty: { width: "17%", fontSize: 9, fontWeight: "bold", color: "#475569", textTransform: "uppercase", textAlign: "center" },
  tableHeaderCellAmt: { width: "17%", fontSize: 9, fontWeight: "bold", color: "#475569", textTransform: "uppercase", textAlign: "right" },
  
  tableRow: { flexDirection: "row", padding: 12 },
  tableCellDesc: { width: "66%", flexDirection: "column" },
  descTitle: { fontSize: 11, fontWeight: "bold", marginBottom: 4 },
  descTxn: { fontSize: 9, color: "#64748b", marginBottom: 8 },
  descBox: { backgroundColor: "#f8fafc", padding: 8, borderRadius: 4, borderStyle: "solid", borderWidth: 1, borderColor: "#f1f5f9" },
  descBoxRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  descBoxLabel: { fontSize: 9, color: "#64748b", fontWeight: "bold" },
  descBoxValValid: { fontSize: 9, color: "#059669", fontWeight: "bold" },
  descBoxValExpired: { fontSize: 9, color: "#e11d48", fontWeight: "bold" },
  
  tableCellQty: { width: "17%", fontSize: 10, color: "#475569", textAlign: "center" },
  tableCellAmt: { width: "17%", fontSize: 10, fontWeight: "bold", textAlign: "right" },
  
  totalsContainer: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 40 },
  totalsBox: { width: "50%", backgroundColor: "#f8fafc", padding: 15, borderRadius: 8, borderStyle: "solid", borderWidth: 1, borderColor: "#e2e8f0" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  totalRowBorder: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 8 },
  totalLabel: { fontSize: 10, color: "#64748b", fontWeight: "bold" },
  totalValue: { fontSize: 10, fontWeight: "bold" },
  finalTotalLabel: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  finalTotalValue: { fontSize: 16, fontWeight: "black", color: "#059669", marginTop: 4 },
  
  footer: { borderTopWidth: 2, borderTopColor: "#f1f5f9", paddingTop: 15, alignItems: "center" },
  footerTitle: { fontSize: 10, fontWeight: "bold", color: "#475569", marginBottom: 4 },
  footerText: { fontSize: 9, color: "#64748b", marginBottom: 2 },
});

// ==========================================
// 2. The PDF Document Layout
// ==========================================
const InvoicePDF = ({ invoice, formatDate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandSection}>
          <Text style={styles.brandTitle}>Bihar Survey Sahayak</Text>
          <Text style={styles.brandText}>viktechzweb@gmail.com</Text>
          <Text style={styles.brandText}>Vaishali, Bihar, India - 844113</Text>
        </View>
        <View style={styles.invoiceSection}>
          <Text style={styles.invoiceTitle}>Tax Invoice</Text>
          <Text style={styles.invoiceDetail}>
            Invoice No: <Text style={styles.invoiceDetailLight}>{invoice.invoiceNo}</Text>
          </Text>
          <Text style={styles.invoiceDetail}>
            Date: <Text style={styles.invoiceDetailLight}>{formatDate(invoice.orderDate)}</Text>
          </Text>
          <Text style={styles.statusBadge}>PAID ({invoice.paymentMethod})</Text>
        </View>
      </View>

      {/* Billed To */}
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.billedToLabel}>Billed To (Amin Profile)</Text>
        <Text style={styles.billedToName}>{invoice.customerDetails.name}</Text>
        <Text style={styles.billedToText}>{invoice.customerDetails.phone} | {invoice.customerDetails.email}</Text>
        <Text style={styles.billedToText}>Address: {invoice.customerDetails.address}</Text>
        <Text style={styles.billedToText}>Govt. Reg No: {invoice.customerDetails.regNo}</Text>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCellDesc}>Description & Service Period</Text>
          <Text style={styles.tableHeaderCellQty}>Qty</Text>
          <Text style={styles.tableHeaderCellAmt}>Amount</Text>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellDesc}>
            <Text style={styles.descTitle}>{invoice.description}</Text>
            <Text style={styles.descTxn}>Transaction ID: {invoice.transactionId}</Text>
            <View style={styles.descBox}>
              <View style={styles.descBoxRow}>
                <Text style={styles.descBoxLabel}>Valid From:</Text>
                <Text style={styles.descBoxValValid}>{formatDate(invoice.startDate)}</Text>
              </View>
              <View style={styles.descBoxRow}>
                <Text style={styles.descBoxLabel}>Valid Until:</Text>
                <Text style={styles.descBoxValExpired}>{formatDate(invoice.endDate)}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.tableCellQty}>1 Month</Text>
          <Text style={styles.tableCellAmt}>Rs {invoice.amount.toFixed(2)}</Text>
        </View>
      </View>

      {/* Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>Rs {invoice.amount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRowBorder}>
            <Text style={styles.totalLabel}>Platform Fee / GST (Included)</Text>
            <Text style={styles.totalValue}>Rs 0.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.finalTotalLabel}>Total Paid</Text>
            <Text style={styles.finalTotalValue}>Rs {invoice.amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Thank you for subscribing to Bihar Survey Sahayak!</Text>
        <Text style={styles.footerText}>This is a computer-generated invoice and does not require a physical signature.</Text>
        <Text style={styles.footerText}>Transaction processed securely via {invoice.paymentMethod}.</Text>
      </View>
    </Page>
  </Document>
);

// ==========================================
// 3. Main Web Component
// ==========================================
export default function InvoicePage() {
  const { txnId } = useParams();
  const router = useRouter();
  
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Hydration safeguard for Next.js
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/wallet/invoice/${txnId}`);
        const data = await res.json();

        if (data.success) {
          setInvoice(data.invoice);
        } else {
          setError(data.error || "Failed to load invoice");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (txnId) fetchInvoice();
  }, [txnId]);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-600 font-medium">Securing and generating your invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <ShieldCheck className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => router.back()} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-900 transition">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      {/* NO-PRINT CONTROLS */}
      <div className="max-w-4xl mx-auto mb-6 px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
          <ArrowLeft size={18} /> Back to Wallet
        </button>
        
        {/* React-PDF Download Button Wrapper */}
        {isClient && invoice && (
          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} formatDate={formatDate} />}
            fileName={`Invoice-${invoice.invoiceNo}.pdf`}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition w-full sm:w-auto justify-center"
          >
            {({ loading }) => (
              <>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {loading ? "Preparing PDF..." : "Download PDF"}
              </>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {/* WEB VIEW (HTML Representation for the screen) */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg px-6 py-10 md:px-16 md:py-16 mx-4 md:mx-auto border border-slate-200 text-slate-800">
        
        {/* Header & Logo */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 overflow-hidden shrink-0">
                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Bihar Survey Sahayak</h2>
            </div>
            <p className="text-slate-500 text-sm">viktechzweb@gmail.com</p>
            <p className="text-slate-500 text-sm">Vaishali, Bihar, India - 844113</p>
          </div>
          <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
            <h1 className="text-3xl font-black text-slate-300 uppercase tracking-widest mb-2">Tax Invoice</h1>
            <p className="font-bold text-slate-700">Invoice No: <span className="font-normal text-slate-600">{invoice.invoiceNo}</span></p>
            <p className="font-bold text-slate-700">Date: <span className="font-normal text-slate-600">{formatDate(invoice.orderDate)}</span></p>
            <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
              <CheckCircle2 size={14} /> PAID ({invoice.paymentMethod})
            </div>
          </div>
        </div>

        {/* Billed To */}
        <div className="mb-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To (Amin Profile)</p>
          <h3 className="text-xl font-bold text-slate-800">{invoice.customerDetails.name}</h3>
          <p className="text-slate-600 mt-1">{invoice.customerDetails.phone} | {invoice.customerDetails.email}</p>
          <p className="text-slate-600 mt-1">Address: {invoice.customerDetails.address}</p>
          <p className="text-slate-500 text-sm mt-1">Govt. Reg No: {invoice.customerDetails.regNo}</p>
        </div>

        {/* Itemized Table */}
        <div className="mb-10 border rounded-xl overflow-hidden border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-xs text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold w-2/3">Description & Service Period</th>
                <th className="p-4 font-bold text-center">Qty</th>
                <th className="p-4 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4">
                  <p className="font-bold text-slate-800 text-base">{invoice.description}</p>
                  <p className="text-sm text-slate-500 mt-1">Transaction ID: {invoice.transactionId}</p>
                  <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                    <p className="flex justify-between mb-1"><span className="text-slate-500 font-semibold">Valid From:</span> <span className="font-bold text-emerald-600">{formatDate(invoice.startDate)}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500 font-semibold">Valid Until:</span> <span className="font-bold text-rose-600">{formatDate(invoice.endDate)}</span></p>
                  </div>
                </td>
                <td className="p-4 text-center font-medium text-slate-600 align-top">1 Month</td>
                <td className="p-4 text-right font-bold text-slate-800 align-top">₹{invoice.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-16">
          <div className="w-full md:w-1/2 bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-slate-500 font-bold">Subtotal</span>
              <span className="font-bold text-slate-800">₹{invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-sm border-b border-slate-200 pb-3">
              <span className="text-slate-500 font-bold">Platform Fee / GST (Included)</span>
              <span className="font-bold text-slate-800">₹0.00</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-xl font-bold text-slate-800">Total Paid</span>
              <span className="text-2xl font-black text-emerald-600">₹{invoice.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-slate-100 pt-6 mt-10 text-center text-slate-500 text-sm flex flex-col items-center">
          <ShieldCheck className="w-6 h-6 text-slate-300 mb-2" />
          <p className="font-bold text-slate-600 mb-1">Thank you for subscribing to Bihar Survey Sahayak!</p>
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
          <p className="mt-2 text-xs text-slate-400">Transaction processed securely via {invoice.paymentMethod}.</p>
          <div className="mt-5 text-xs text-slate-400">
            Invoice generated on {new Date().toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}
