"use client";

import DashboardLayout from "../components/DashboardLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Square, Trash2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function TranscriptionsContent() {
  // Always call hooks unconditionally - this is required by React
  // Convex hooks will return undefined if not connected, which is fine
  const transcriptions = useQuery(api.transcriptions.list);
  const completeTranscription = useMutation(api.transcriptions.complete);
  const deleteTranscription = useMutation(api.transcriptions.remove);
  
  const [elapsedTime, setElapsedTime] = useState(0);

  // Handle loading/error state
  if (transcriptions === undefined) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-[#e0d9cc] bg-[#faf9f5]">
          <div className="px-8 py-4">
            <h2 className="text-2xl font-semibold text-[#2c2416]">Transcriptions</h2>
          </div>
        </header>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg text-[#7a6f5c] mb-2">Loading transcriptions...</p>
            <p className="text-sm text-[#a89d87]">
              {process.env.NEXT_PUBLIC_CONVEX_URL 
                ? "Connecting to Convex..." 
                : "Convex not configured. Add NEXT_PUBLIC_CONVEX_URL to Netlify environment variables."}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const transcriptionsList = transcriptions || [];

  // Find active transcription
  const activeTranscription = transcriptionsList.find((t) => t.status === "active");
  const completedTranscriptions = transcriptionsList.filter((t) => t.status === "completed");

  // Update elapsed time for active transcription
  useEffect(() => {
    if (!activeTranscription) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - activeTranscription.startedAt) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTranscription]);

  const handleStop = async () => {
    if (activeTranscription && completeTranscription) {
      try {
        await completeTranscription({ sessionId: activeTranscription.sessionId });
        console.log("✅ Transcription stopped and saved");
      } catch (error) {
        console.error("Error stopping transcription:", error);
      }
    }
  };

  const handleDelete = async (id: Id<"transcriptions">) => {
    if (deleteTranscription && confirm("Are you sure you want to delete this transcription?")) {
      try {
        await deleteTranscription({ id });
      } catch (error) {
        console.error("Error deleting transcription:", error);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[#e0d9cc] bg-[#faf9f5]">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#2c2416]">Transcriptions</h2>
            <div className="text-sm text-[#7a6f5c]">
              Powered by Convex • Real-time updates
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        {transcriptionsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-[#7a6f5c] mb-4">No transcriptions yet</p>
            <p className="text-sm text-[#a89d87] text-center max-w-md">
              When you turn on your OMI device, transcriptions will automatically appear here.
              All transcriptions are saved permanently.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Transcription Card */}
            {activeTranscription && (
              <div className="rounded-lg border-2 border-[#c9bfab] bg-[#faf9f5] p-6 shadow-lg relative overflow-hidden">
                {/* Glowing indicator with animation */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full bg-green-400 opacity-50 animate-pulse"></div>
                    <div className="relative w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-medium text-[#2c2416]">Recording</span>
                </div>

                <div className="pr-24">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2c2416] mb-1">
                        {activeTranscription.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#7a6f5c]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(elapsedTime)}
                        </span>
                        <span>Started {formatDate(activeTranscription.startedAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </button>
                  </div>

                  <div className="mt-4 p-4 bg-white rounded border border-[#e0d9cc] min-h-[200px] max-h-[400px] overflow-y-auto">
                    {activeTranscription.transcript ? (
                      <p className="text-[#2c2416] whitespace-pre-wrap leading-relaxed">
                        {activeTranscription.transcript}
                      </p>
                    ) : (
                      <p className="text-[#a89d87] italic">Waiting for transcription...</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Completed Transcriptions */}
            {completedTranscriptions.map((transcription) => {
              const duration = transcription.completedAt && transcription.startedAt
                ? Math.floor((transcription.completedAt - transcription.startedAt) / 1000)
                : 0;

              return (
                <div
                  key={transcription._id}
                  className="rounded-lg border border-[#e0d9cc] bg-[#faf9f5] p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2c2416] mb-1">
                        {transcription.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#7a6f5c]">
                        {duration > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(duration)}
                          </span>
                        )}
                        {transcription.completedAt && (
                          <span>
                            Completed {formatDate(transcription.completedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(transcription._id)}
                      className="ml-4 rounded-md border border-[#c9bfab] bg-white px-3 py-2 text-[#2c2416] hover:bg-[#f5f3ed] transition-colors"
                      title="Delete transcription"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 p-4 bg-white rounded border border-[#e0d9cc] min-h-[100px] max-h-[300px] overflow-y-auto">
                    {transcription.transcript ? (
                      <p className="text-[#2c2416] whitespace-pre-wrap leading-relaxed">
                        {transcription.transcript}
                      </p>
                    ) : (
                      <p className="text-[#a89d87] italic">No transcript available</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TranscriptionsPage() {
  return (
    <DashboardLayout>
      <TranscriptionsContent />
    </DashboardLayout>
  );
}

