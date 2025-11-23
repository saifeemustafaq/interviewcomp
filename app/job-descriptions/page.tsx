"use client";

import DashboardLayout from "../components/DashboardLayout";

export default function JobDescriptionsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <header className="border-b border-[#e0d9cc] bg-[#faf9f5]">
          <div className="px-8 py-4">
            <h2 className="text-2xl font-semibold text-[#2c2416]">Job Descriptions</h2>
          </div>
        </header>
        <div className="p-8">
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-[#7a6f5c] mb-4">Job Descriptions coming soon</p>
            <p className="text-sm text-[#a89d87] text-center max-w-md">
              Add and manage job descriptions to extract key skills and competencies for targeted practice.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

