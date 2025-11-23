// Shared storage for transcriptions
// NOTE: This is temporary. In production, use Convex or a database.
// This resets on serverless function cold starts.

export interface StoredTranscription {
  id: string;
  sessionId: string;
  title: string;
  transcript: string;
  status: "active" | "completed";
  startedAt: string;
  completedAt?: string;
  lastUpdated: string;
}

let transcriptionsStore: StoredTranscription[] = [];

export function getTranscriptions(): StoredTranscription[] {
  return transcriptionsStore;
}

export function addOrUpdateTranscription(data: {
  sessionId: string;
  transcript: string;
  status?: "active" | "completed";
  title?: string;
}): StoredTranscription {
  const existingIndex = transcriptionsStore.findIndex(
    (t) => t.sessionId === data.sessionId
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    // Update existing
    const existing = transcriptionsStore[existingIndex];
    
    // Don't update if already completed (unless explicitly setting status)
    if (existing.status === "completed" && !data.status) {
      return existing; // Return existing without updating
    }
    
    transcriptionsStore[existingIndex] = {
      ...existing,
      transcript: existing.transcript
        ? existing.transcript + " " + data.transcript
        : data.transcript,
      status: data.status || existing.status,
      lastUpdated: now,
      completedAt: data.status === "completed" ? now : existing.completedAt,
    };
    return transcriptionsStore[existingIndex];
  } else {
    // Create new
    const newTranscription: StoredTranscription = {
      id: `transcription-${Date.now()}`,
      sessionId: data.sessionId,
      title: data.title || `Transcription ${transcriptionsStore.length + 1}`,
      transcript: data.transcript || "",
      status: data.status || "active",
      startedAt: now,
      lastUpdated: now,
    };
    transcriptionsStore.push(newTranscription);
    return newTranscription;
  }
}

export function completeTranscription(sessionIdOrId: string): StoredTranscription | null {
  const transcription = transcriptionsStore.find(
    (t) => t.sessionId === sessionIdOrId || t.id === sessionIdOrId
  );
  
  if (transcription && transcription.status === "active") {
    const index = transcriptionsStore.findIndex(
      (t) => t.sessionId === sessionIdOrId || t.id === sessionIdOrId
    );
    const now = new Date().toISOString();
    transcriptionsStore[index] = {
      ...transcription,
      status: "completed",
      completedAt: now,
      lastUpdated: now,
    };
    return transcriptionsStore[index];
  }
  return null;
}

export function deleteTranscription(id: string): boolean {
  const index = transcriptionsStore.findIndex((t) => t.id === id);
  if (index >= 0) {
    transcriptionsStore.splice(index, 1);
    return true;
  }
  return false;
}

