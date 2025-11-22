"use client";

import DashboardLayout from "../components/DashboardLayout";
import { useTranscriptions } from "../components/TranscriptionContext";
import { Square, Trash2, Clock } from "lucide-react";
import { useEffect, useState } from "react";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function TranscriptionsContent() {
  const {
    transcriptions: contextTranscriptions,
    activeTranscription,
    stopTranscription,
    deleteTranscription,
    addTranscriptionFromWebhook,
  } = useTranscriptions();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPolling, setIsPolling] = useState(true);

  // Poll for new transcriptions from webhook
  useEffect(() => {
    if (!isPolling) return;

    const fetchTranscriptions = async () => {
      try {
        const response = await fetch('/api/transcriptions');
        const data = await response.json();
        
        if (data.success && data.transcriptions && Array.isArray(data.transcriptions)) {
          // Process each transcription from API
          data.transcriptions.forEach((apiTranscription: any) => {
            // Find existing transcription by sessionId (since API uses sessionId)
            const existing = contextTranscriptions.find(
              (t) => t.id === apiTranscription.id || 
                     (t as any).sessionId === apiTranscription.sessionId
            );

            if (!existing) {
              // New transcription - add it
              addTranscriptionFromWebhook({
                transcript: apiTranscription.transcript || "",
                timestamp: new Date(apiTranscription.startedAt),
              });
            } else if (existing.status === 'active' && apiTranscription.status === 'active') {
              // Update existing active transcription if transcript changed
              const currentTranscript = existing.transcript || "";
              const newTranscript = apiTranscription.transcript || "";
              
              // Only update if the new transcript is longer (has more content)
              if (newTranscript.length > currentTranscript.length) {
                // Update the existing transcription
                addTranscriptionFromWebhook({
                  transcript: newTranscript,
                  timestamp: new Date(apiTranscription.startedAt),
                });
              }
            } else if (apiTranscription.status === 'completed' && existing.status === 'active') {
              // Mark as completed if API says so
              stopTranscription(existing.id);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching transcriptions:', error);
      }
    };

    // Poll every 2 seconds for real-time updates
    const interval = setInterval(fetchTranscriptions, 2000);
    fetchTranscriptions(); // Initial fetch

    return () => clearInterval(interval);
  }, [isPolling, contextTranscriptions, addTranscriptionFromWebhook, stopTranscription]);

  // Use context transcriptions
  const transcriptions = contextTranscriptions;

  // Update elapsed time for active transcription
  useEffect(() => {
    if (!activeTranscription) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (new Date().getTime() - activeTranscription.startedAt.getTime()) / 1000
      );
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTranscription]);

  const handleStop = () => {
    if (activeTranscription) {
      stopTranscription(activeTranscription.id);
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
              Webhook URL: <code className="bg-[#ede9e0] px-2 py-1 rounded text-xs">
                /api/omi/webhook
              </code>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        {transcriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-[#7a6f5c] mb-4">No transcriptions yet</p>
            <p className="text-sm text-[#a89d87] text-center max-w-md">
              When you turn on your OMI device, transcriptions will automatically appear here.
              Make sure your webhook URL is configured in OMI settings.
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
            {transcriptions
              .filter((t) => t.status === "completed")
              .map((transcription) => (
                <div
                  key={transcription.id}
                  className="rounded-lg border border-[#e0d9cc] bg-[#faf9f5] p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2c2416] mb-1">
                        {transcription.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#7a6f5c]">
                        {transcription.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(transcription.duration)}
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
                      onClick={() => deleteTranscription(transcription.id)}
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
              ))}
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

