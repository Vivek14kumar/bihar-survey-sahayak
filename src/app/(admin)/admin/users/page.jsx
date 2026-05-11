// src/app/(admin)/admin/users/page.jsx
import dbConnect from "../../../api/utils/dbConnect";
import User from "../../../api/models/User";
import Document from "@/app/api/models/Document";
import DailyTarget from "../../../api/models/DailyTarget";
import OperatorDashboardClient from "./OperatorDashboardClient";


export const dynamic = "force-dynamic";

async function getOperatorData() {
  await dbConnect();
  
  const todayStr = new Date().toISOString().split("T")[0];
  
  // 1. Fetch Operators
  const operators = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 }).lean();
  
  // 2. Fetch Today's Targets for everyone
  const allTodayTargets = await DailyTarget.find({ dateString: todayStr }).lean();
  
  // 3. Attach the specific targets to each operator
  const mappedOperators = operators.map(op => {
    const opTargetDoc = allTodayTargets.find(t => t.user.toString() === op._id.toString());
    
    return {
      ...op,
      _id: op._id.toString(),
      createdAt: op.createdAt ? new Date(op.createdAt).toISOString() : null,
      updatedAt: op.updatedAt ? new Date(op.updatedAt).toISOString() : null,
      
      activeTargets: opTargetDoc ? opTargetDoc.targets.map(t => ({
        formName: t.formName,
        targetForm: t.targetForm,
        currentProgress: t.currentProgress,
        cashbackReward: t.cashbackReward,
        isRewardClaimed: t.isRewardClaimed,
        _id: t._id ? t._id.toString() : null 
      })) : [] 
    };
  });

  // 👉 NEW: Calculate Leaderboard using the new DailyTargets data
  const leaderboard = [...mappedOperators]
    .map(op => {
      // Add up all forms generated today across all targets
      const totalToday = op.activeTargets.reduce((sum, target) => sum + target.currentProgress, 0);
      return { ...op, todayFormsGenerated: totalToday };
    })
    .filter(op => op.todayFormsGenerated > 0) // Only include active operators
    .sort((a, b) => b.todayFormsGenerated - a.todayFormsGenerated) // Sort highest to lowest
    .slice(0, 5); // Take top 5

  // 4. Fetch Network Stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDocsCount = await Document.countDocuments({ date: { $gte: today } });
  const totalRefundsCount = await Document.countDocuments({ status: "REFUNDED" });
  
  const targetAchievers = mappedOperators.filter(op => 
    op.activeTargets.some(t => t.currentProgress >= t.targetForm)
  ).length;

  const stats = {
    totalOperators: operators.length,
    todayNetworkVolume: todayDocsCount,
    totalRefunds: totalRefundsCount,
    targetAchievers: targetAchievers
  };

  // Ensure leaderboard is returned here
  return { operators: mappedOperators, leaderboard, stats };
}

export default async function OperatorManagementPage() {
  const { operators, leaderboard, stats } = await getOperatorData();

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operator Command Center</h1>
        <p className="text-slate-500 text-sm mt-1">Manage form-specific targets, view network health, and adjust accounts.</p>
      </div>

      <OperatorDashboardClient 
        initialOperators={operators} 
        leaderboard={leaderboard} // 👉 PASSED CORRECTLY HERE
        networkStats={stats} 
      />
    </div>
  );
}