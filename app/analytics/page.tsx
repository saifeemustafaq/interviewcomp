"use client";

import DashboardLayout from "../components/DashboardLayout";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="border-b border-[#e0d9cc] bg-[#faf9f5]">
          <div className="px-8 py-4">
            <h2 className="text-2xl font-semibold text-[#2c2416]">Analytics</h2>
          </div>
        </header>
        <div className="p-8">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-[#7a6f5c] mb-4">Analytics coming soon</p>
            <p className="text-sm text-[#a89d87] text-center max-w-md">
              Track your interview performance over time, see improvement trends, and identify patterns.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

