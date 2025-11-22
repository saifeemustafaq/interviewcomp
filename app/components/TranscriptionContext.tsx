"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface Transcription {
  id: string;
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
    (data: { transcript: string; timestamp?: Date }) => {
      setTranscriptions((prev) => {
        // Check if there's an active transcription
        const active = prev.find((t) => t.status === "active");
        if (active) {
          // Append to active transcription
          return prev.map((t) =>
            t.id === active.id
              ? { ...t, transcript: t.transcript + " " + data.transcript }
              : t
          );
        } else {
          // Create new active transcription from webhook
          const id = `transcription-${Date.now()}`;
          const newTranscription: Transcription = {
            id,
            title: `Transcription ${prev.length + 1}`,
            transcript: data.transcript,
            status: "active",
            startedAt: data.timestamp || new Date(),
          };
          return [newTranscription, ...prev];
        }
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

