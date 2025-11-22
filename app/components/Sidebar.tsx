"use client";

import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  FileText, 
  Settings,
  Plus,
  Mic,
  FileText as FileTextIcon
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Session {
  id: string;
  title: string;
  date: string;
  type: "mock" | "debrief";
}

interface SidebarProps {
  sessions: Session[];
  onNewSession: () => void;
  onSessionClick: (sessionId: string) => void;
  activeItem?: string;
}

const permanentNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transcriptions", label: "Transcriptions", icon: FileTextIcon },
  { id: "sessions", label: "Sessions", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "job-descriptions", label: "Job Descriptions", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ 
  sessions, 
  onNewSession, 
  onSessionClick,
  activeItem = "dashboard" 
}: SidebarProps) {
  const [expandedSessions, setExpandedSessions] = useState(true);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-[#e0d9cc] bg-[#faf9f5] flex flex-col">
      {/* Logo/Header */}
      <div className="border-b border-[#e0d9cc] p-6">
        <h1 className="text-xl font-semibold text-[#2c2416]">Interview Companion</h1>
      </div>

      {/* Permanent Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <ul className="space-y-1">
            {permanentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const href = item.id === "dashboard" ? "/" : `/${item.id}`;
              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-[#ede9e0] text-[#2c2416] font-medium"
                        : "text-[#7a6f5c] hover:bg-[#f5f3ed] hover:text-[#2c2416]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sessions Section */}
        <div className="border-t border-[#e0d9cc] pt-4">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() => setExpandedSessions(!expandedSessions)}
              className="flex items-center gap-2 text-xs font-medium text-[#7a6f5c] uppercase tracking-wide hover:text-[#2c2416]"
            >
              <span>Sessions</span>
            </button>
            <button
              onClick={onNewSession}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-[#c9bfab] text-[#2c2416] hover:bg-[#a89d87] transition-colors"
              title="New Session"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {expandedSessions && (
            <ul className="space-y-1">
              {sessions.length === 0 ? (
                <li className="px-3 py-2 text-xs text-[#7a6f5c] italic">
                  No sessions yet
                </li>
              ) : (
                sessions.map((session) => (
                  <li key={session.id}>
                    <button
                      onClick={() => onSessionClick(session.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#7a6f5c] hover:bg-[#f5f3ed] hover:text-[#2c2416] transition-colors"
                    >
                      <Mic className="h-4 w-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{session.title}</div>
                        <div className="text-xs text-[#a89d87]">{session.date}</div>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
}

