import type { VoiceMemo } from "@/lib/zod/schemas";

const DB_NAME = "voice-memos-db";
const DB_VERSION = 1;
const STORE_NAME = "memos";

/**
 * Internal interface for IndexedDB storage.
 * Stores audio blob along with metadata.
 */
interface StoredMemo {
  id: string;
  url: string;
  duration: number;
  timestamp: number;
  visitId: string;
  blob: Blob;
}

/**
 * Opens the IndexedDB database and creates the object store if needed.
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("visitId", "visitId", { unique: false });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

/**
 * Saves a voice memo audio blob to IndexedDB.
 * Creates a blob URL for immediate use.
 *
 * @param audioBlob - The audio blob to store
 * @param visitId - The associated visit ID
 * @returns Success result with memo ID, or error message
 */
export async function saveVoiceMemo(
  audioBlob: Blob,
  visitId: string
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  try {
    const id = crypto.randomUUID();
    const timestamp = Date.now();

    const db = await openDatabase();

    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const url = URL.createObjectURL(audioBlob);

      const storedMemo: StoredMemo = {
        id,
        url,
        duration: 0, // Will be updated when duration is calculated
        timestamp,
        visitId,
        blob: audioBlob,
      };

      const request = store.add(storedMemo);

      request.onsuccess = () => {
        db.close();
        resolve({ success: true, id });
      };

      request.onerror = () => {
        URL.revokeObjectURL(url);
        db.close();

        const error = request.error;
        if (error?.name === "QuotaExceededError") {
          resolve({ success: false, error: "Storage quota exceeded. Delete old memos to free space." });
        } else {
          resolve({ success: false, error: `Failed to save voice memo: ${error?.message}` });
        }
      };
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `Database error: ${errorMessage}` };
  }
}

/**
 * Retrieves a voice memo by ID.
 * Creates a new blob URL for the stored audio blob.
 *
 * @param id - The memo ID to retrieve
 * @returns Voice memo with URL, or null if not found
 */
export async function getVoiceMemo(id: string): Promise<VoiceMemo | null> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const storedMemo = request.result as StoredMemo | undefined;

        if (!storedMemo) {
          db.close();
          resolve(null);
          return;
        }

        // Create a new blob URL for the stored blob
        const url = URL.createObjectURL(storedMemo.blob);

        const voiceMemo: VoiceMemo = {
          id: storedMemo.id,
          url,
          duration: storedMemo.duration,
          timestamp: new Date(storedMemo.timestamp),
          visitId: storedMemo.visitId,
        };

        db.close();
        resolve(voiceMemo);
      };

      request.onerror = () => {
        db.close();
        reject(new Error(`Failed to retrieve voice memo: ${request.error?.message}`));
      };
    });
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

/**
 * Deletes a voice memo from IndexedDB by ID.
 *
 * @param id - The memo ID to delete
 */
export async function deleteVoiceMemo(id: string): Promise<void> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        db.close();
        resolve();
      };

      request.onerror = () => {
        db.close();
        reject(new Error(`Failed to delete voice memo: ${request.error?.message}`));
      };
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Database error: ${errorMessage}`);
  }
}

/**
 * Lists all voice memos from IndexedDB.
 * Creates blob URLs for each memo.
 *
 * @returns Array of voice memos
 */
export async function listVoiceMemos(): Promise<VoiceMemo[]> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const storedMemos = request.result as StoredMemo[];

        const voiceMemos: VoiceMemo[] = storedMemos.map((storedMemo) => ({
          id: storedMemo.id,
          url: URL.createObjectURL(storedMemo.blob),
          duration: storedMemo.duration,
          timestamp: new Date(storedMemo.timestamp),
          visitId: storedMemo.visitId,
        }));

        db.close();
        resolve(voiceMemos);
      };

      request.onerror = () => {
        db.close();
        reject(new Error(`Failed to list voice memos: ${request.error?.message}`));
      };
    });
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

/**
 * Updates a voice memo's duration.
 *
 * @param id - The memo ID to update
 * @param duration - The duration in seconds
 */
export async function updateVoiceMemoDuration(
  id: string,
  duration: number
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const db = await openDatabase();

    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const storedMemo = getRequest.result as StoredMemo | undefined;

        if (!storedMemo) {
          db.close();
          resolve({ success: false, error: "Voice memo not found" });
          return;
        }

        storedMemo.duration = duration;

        const putRequest = store.put(storedMemo);

        putRequest.onsuccess = () => {
          db.close();
          resolve({ success: true });
        };

        putRequest.onerror = () => {
          db.close();
          resolve({ success: false, error: `Failed to update duration: ${putRequest.error?.message}` });
        };
      };

      getRequest.onerror = () => {
        db.close();
        resolve({ success: false, error: `Failed to retrieve voice memo: ${getRequest.error?.message}` });
      };
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `Database error: ${errorMessage}` };
  }
}

/**
 * Cleans up expired voice memos older than 30 days.
 * Removes both the blob from IndexedDB and revokes URLs.
 *
 * @returns Number of memos removed
 */
export async function cleanupExpiredMemos(): Promise<number> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("timestamp");

      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const range = IDBKeyRange.upperBound(thirtyDaysAgo);

      const request = index.openCursor(range);
      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;

        if (cursor) {
          const storedMemo = cursor.value as StoredMemo;

          // Revoke the old URL if it exists
          try {
            URL.revokeObjectURL(storedMemo.url);
          } catch {
            // Ignore revoke errors (URL may already be invalid)
          }

          cursor.delete();
          deletedCount++;
          cursor.continue();
        } else {
          // No more entries
          db.close();
          resolve(deletedCount);
        }
      };

      request.onerror = () => {
        db.close();
        reject(new Error(`Failed to cleanup expired memos: ${request.error?.message}`));
      };
    });
  } catch (error) {
    console.error("Database error:", error);
    return 0;
  }
}

/**
 * Lists voice memos for a specific visit.
 *
 * @param visitId - The visit ID to filter by
 * @returns Array of voice memos for the visit
 */
export async function listVoiceMemosByVisit(visitId: string): Promise<VoiceMemo[]> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("visitId");

      const request = index.getAll(visitId);

      request.onsuccess = () => {
        const storedMemos = request.result as StoredMemo[];

        const voiceMemos: VoiceMemo[] = storedMemos.map((storedMemo) => ({
          id: storedMemo.id,
          url: URL.createObjectURL(storedMemo.blob),
          duration: storedMemo.duration,
          timestamp: new Date(storedMemo.timestamp),
          visitId: storedMemo.visitId,
        }));

        db.close();
        resolve(voiceMemos);
      };

      request.onerror = () => {
        db.close();
        reject(new Error(`Failed to list voice memos: ${request.error?.message}`));
      };
    });
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}
