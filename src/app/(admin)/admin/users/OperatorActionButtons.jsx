// src/app/(admin)/admin/users/OperatorActionButtons.jsx
"use client";

import { useState } from "react";
import { Plus, Minus, Target } from "lucide-react";
import { updateWalletBalance, updateOperatorTarget } from "@/app/actions/adminActions";

export default function OperatorActionButtons({ userId, currentBalance, currentTarget, currentReward }) {
  const [loading, setLoading] = useState(false);

  const handleAddFunds = async () => {
    const amount = prompt(`Enter amount to ADD to Wallet (Current: ₹${currentBalance}):`);
    if (!amount || isNaN(amount)) return;
    
    setLoading(true);
    try {
      await updateWalletBalance(userId, amount, "ADD", "Admin Top-Up");
      alert(`✅ ₹${amount} added successfully.`);
    } catch (error) {
      alert("❌ Failed to update wallet.");
    }
    setLoading(false);
  };

  const handleEditTarget = async () => {
    const newTarget = prompt(`Enter new Daily Target Forms (Current: ${currentTarget}):`, currentTarget);
    const newReward = prompt(`Enter Cashback Reward amount (Current: ₹${currentReward}):`, currentReward);
    
    if (!newTarget || !newReward || isNaN(newTarget) || isNaN(newReward)) return;

    setLoading(true);
    try {
      await updateOperatorTarget(userId, newTarget, newReward);
      alert(`✅ Target updated to ${newTarget} forms for ₹${newReward} reward.`);
    } catch (error) {
      alert("❌ Failed to update target.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-end gap-2">
      <button 
        onClick={handleAddFunds}
        disabled={loading}
        className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200 hover:bg-blue-100 transition disabled:opacity-50"
      >
        <Plus size={14} /> Top-Up
      </button>
      
      <button 
        onClick={handleEditTarget}
        disabled={loading}
        className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-200 hover:bg-purple-100 transition disabled:opacity-50"
      >
        <Target size={14} /> Target
      </button>
    </div>
  );
}