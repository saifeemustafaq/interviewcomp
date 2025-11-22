"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Session {
  id: string;
  title: string;
  date: string;
  type: "mock" | "debrief";
}

interface SessionContextType {
  sessions: Session[];
  createSession: (title?: string, type?: "mock" | "debrief") => void;
  selectSession: (sessionId: string) => void;
  selectedSession: string | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      title: "Product Security Role - Round 1",
      date: "2 days ago",
      type: "mock",
    },
    {
      id: "2",
      title: "Security Engineer - Final Round",
      date: "1 week ago",
      type: "debrief",
    },
  ]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const createSession = (title?: string, type: "mock" | "debrief" = "mock") => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: title || `New Session ${sessions.length + 1}`,
      date: "Just now",
      type,
    };
    setSessions([newSession, ...sessions]);
    setSelectedSession(newSession.id);
    return newSession.id;
  };

  const selectSession = (sessionId: string) => {
    setSelectedSession(sessionId);
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        createSession,
        selectSession,
        selectedSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessions must be used within a SessionProvider");
  }
  return context;
}

