"use client";

import Sidebar from "./Sidebar";
import { SessionProvider, useSessions } from "./SessionContext";
import { TranscriptionProvider } from "./TranscriptionContext";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayoutInner({ children }: DashboardLayoutProps) {
  const { sessions, createSession, selectSession } = useSessions();
  const pathname = usePathname();
  
  // Determine active item from pathname
  const getActiveItem = () => {
    if (pathname === "/") return "dashboard";
    if (pathname.startsWith("/transcriptions")) return "transcriptions";
    if (pathname.startsWith("/sessions")) return "sessions";
    if (pathname.startsWith("/analytics")) return "analytics";
    if (pathname.startsWith("/job-descriptions")) return "job-descriptions";
    if (pathname.startsWith("/settings")) return "settings";
    return "dashboard";
  };

  const activeItem = getActiveItem();

  const handleNewSession = () => {
    createSession();
  };

  const handleSessionClick = (sessionId: string) => {
    selectSession(sessionId);
  };

  return (
    <div className="flex min-h-screen bg-[#fefdfb]">
      <Sidebar
        sessions={sessions}
        onNewSession={handleNewSession}
        onSessionClick={handleSessionClick}
        activeItem={getActiveItem()}
      />
      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SessionProvider>
      <TranscriptionProvider>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </TranscriptionProvider>
    </SessionProvider>
  );
}

