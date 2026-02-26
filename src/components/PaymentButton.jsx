"use client";

import { useState } from "react";

export default function PaymentButton({
  amount = 1000, // in paise (₹10 = 1000)
  label = "Pay Now",
  onSuccess, // callback after payment success
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create Razorpay Order from backend
      const res = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();

      if (!order.id) {
        alert("Order creation failed");
        setLoading(false);
        return;
      }

      // 2️⃣ Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Vanshavali Generator",
        description: "Premium Access",
        order_id: order.id,

        handler: function (response) {
          // Payment success
          if (onSuccess) {
            onSuccess(response);
          }
        },

        theme: {
          color: "#0f172a",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg transition"
    >
      {loading ? "Processing..." : label}
    </button>
  );
}