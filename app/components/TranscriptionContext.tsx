"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface Transcription {
  id: string;
  sessionId?: string; // For matching with API transcriptions
  title: string;
  transcript: string;
  status: "active" | "completed";
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
}

interface TranscriptionContextType {
  transcriptions: Transcription[];
  activeTranscription: Transcription | null;
  startTranscription: (title?: string) => string;
  stopTranscription: (id: string) => void;
  updateTranscription: (id: string, transcript: string) => void;
  addTranscriptionFromWebhook: (data: { transcript: string; timestamp?: Date }) => void;
  deleteTranscription: (id: string) => void;
}

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);

export function TranscriptionProvider({ children }: { children: ReactNode }) {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);

  const startTranscription = useCallback((title?: string): string => {
    const id = `transcription-${Date.now()}`;
    const newTranscription: Transcription = {
      id,
      title: title || `Transcription ${transcriptions.length + 1}`,
      transcript: "",
      status: "active",
      startedAt: new Date(),
    };
    setTranscriptions((prev) => [newTranscription, ...prev]);
    return id;
  }, [transcriptions.length]);

  const stopTranscription = useCallback((id: string) => {
    setTranscriptions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "completed" as const,
              completedAt: new Date(),
              duration: t.startedAt
                ? Math.floor((new Date().getTime() - t.startedAt.getTime()) / 1000)
                : 0,
            }
          : t
      )
    );
  }, []);

  const updateTranscription = useCallback((id: string, transcript: string) => {
    setTranscriptions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, transcript } : t))
    );
  }, []);

  const addTranscriptionFromWebhook = useCallback(
    (data: { transcript: string; timestamp?: Date; sessionId?: string; id?: string; title?: string }) => {
      setTranscriptions((prev) => {
        // If we have sessionId, try to find existing by sessionId
        if (data.sessionId) {
          const existing = prev.find((t) => t.sessionId === data.sessionId);
          if (existing) {
            // Update existing transcription
            return prev.map((t) =>
              t.sessionId === data.sessionId
                ? {
                    ...t,
                    transcript: data.transcript || t.transcript,
                    title: data.title || t.title,
                  }
                : t
            );
          }
        }

        // If we have id, try to find existing by id
        if (data.id) {
          const existing = prev.find((t) => t.id === data.id);
          if (existing) {
            return prev.map((t) =>
              t.id === data.id
                ? {
                    ...t,
                    transcript: data.transcript || t.transcript,
                    title: data.title || t.title,
                  }
                : t
            );
          }
        }

        // Check if there's an active transcription (fallback)
        const active = prev.find((t) => t.status === "active" && !data.sessionId);
        if (active) {
          // Append to active transcription
          return prev.map((t) =>
            t.id === active.id
              ? { ...t, transcript: t.transcript + " " + data.transcript }
              : t
          );
        }

        // Create new active transcription from webhook
        const id = data.id || `transcription-${Date.now()}`;
        const newTranscription: Transcription = {
          id,
          sessionId: data.sessionId,
          title: data.title || `Transcription ${prev.length + 1}`,
          transcript: data.transcript || "",
          status: "active",
          startedAt: data.timestamp || new Date(),
        };
        return [newTranscription, ...prev];
      });
    },
    []
  );

  const deleteTranscription = useCallback((id: string) => {
    setTranscriptions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const activeTranscription = transcriptions.find((t) => t.status === "active") || null;

  return (
    <TranscriptionContext.Provider
      value={{
        transcriptions,
        activeTranscription,
        startTranscription,
        stopTranscription,
        updateTranscription,
        addTranscriptionFromWebhook,
        deleteTranscription,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscriptions() {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error("useTranscriptions must be used within a TranscriptionProvider");
  }
  return context;
}

