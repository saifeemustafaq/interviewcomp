"use client";

import DashboardLayout from "./components/DashboardLayout";
import { useSessions } from "./components/SessionContext";
import { FileText, Mic, BarChart3, Target, Sparkles } from "lucide-react";

function DashboardContent() {
  const { createSession } = useSessions();

  const handleNewSession = () => {
    createSession();
  };

  return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-[#e0d9cc] bg-[#faf9f5]">
          <div className="px-8 py-4">
            <h2 className="text-2xl font-semibold text-[#2c2416]">Dashboard</h2>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-light text-[#2c2416] tracking-tight">
              Your Interview Coach
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#7a6f5c] leading-relaxed">
              Practice smarter, improve faster. Get AI-powered feedback on your interview answers,
              track your progress, and master the art of storytelling.
            </p>
          </section>

          {/* Quick Actions */}
          <section className="mb-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-[#e0d9cc] bg-[#faf9f5] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <FileText className="h-8 w-8 text-[#7a6f5c]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#2c2416]">Add Job Description</h3>
              <p className="mb-4 text-[#7a6f5c]">
                Paste the job description to extract key skills and competencies for targeted practice.
              </p>
              <button className="rounded-md bg-[#c9bfab] px-6 py-2 text-[#2c2416] hover:bg-[#a89d87] transition-colors">
                Add JD
              </button>
            </div>

            <div className="rounded-lg border border-[#e0d9cc] bg-[#faf9f5] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <Mic className="h-8 w-8 text-[#7a6f5c]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#2c2416]">Start Session</h3>
              <p className="mb-4 text-[#7a6f5c]">
                Begin a mock interview or post-interview debrief. Omi will capture and analyze your responses.
              </p>
              <button 
                onClick={handleNewSession}
                className="rounded-md bg-[#c9bfab] px-6 py-2 text-[#2c2416] hover:bg-[#a89d87] transition-colors"
              >
                New Session
              </button>
            </div>
          </section>

          {/* Recent Sessions */}
          <section className="mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-[#2c2416]">Recent Sessions</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#e0d9cc] bg-[#faf9f5] p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="mb-2 text-lg font-semibold text-[#2c2416]">
                        Product Security Role - Round 1
                      </h4>
                      <p className="mb-3 text-[#7a6f5c]">
                        Mock interview session • 45 minutes • 8 questions analyzed
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="rounded-full bg-[#ede9e0] px-3 py-1 text-[#4a4234]">
                          STAR: 75%
                        </span>
                        <span className="rounded-full bg-[#ede9e0] px-3 py-1 text-[#4a4234]">
                          Keywords: 12/15
                        </span>
                      </div>
                    </div>
                    <button className="ml-4 rounded-md border border-[#c9bfab] bg-white px-4 py-2 text-[#2c2416] hover:bg-[#f5f3ed] transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Grid */}
          <section>
            <h3 className="mb-6 text-2xl font-semibold text-[#2c2416]">How It Works</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-[#e0d9cc] bg-[#f5f3ed] p-6">
                <div className="mb-3">
                  <BarChart3 className="h-6 w-6 text-[#7a6f5c]" />
                </div>
                <h4 className="mb-2 font-semibold text-[#2c2416]">Structure Analysis</h4>
                <p className="text-sm text-[#7a6f5c]">
                  Evaluates your answers for STAR format, technical depth, and use of metrics.
                </p>
              </div>
              <div className="rounded-lg border border-[#e0d9cc] bg-[#f5f3ed] p-6">
                <div className="mb-3">
                  <Target className="h-6 w-6 text-[#7a6f5c]" />
                </div>
                <h4 className="mb-2 font-semibold text-[#2c2416]">JD Relevance</h4>
                <p className="text-sm text-[#7a6f5c]">
                  Highlights which keywords you hit or missed, ensuring alignment with the role.
                </p>
              </div>
              <div className="rounded-lg border border-[#e0d9cc] bg-[#f5f3ed] p-6">
                <div className="mb-3">
                  <Sparkles className="h-6 w-6 text-[#7a6f5c]" />
                </div>
                <h4 className="mb-2 font-semibold text-[#2c2416]">Improved Versions</h4>
                <p className="text-sm text-[#7a6f5c]">
                  Get AI-suggested rewrites of your answers with better phrasing and impact.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
}

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
