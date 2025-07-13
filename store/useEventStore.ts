import { EventData } from "@/data/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Zustand Store for managing event state
interface EventStore {
  currentEvent: EventData | null;
  setCurrentEvent: (event: EventData) => void;
  clearEventStore: () => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      currentEvent: null,
      setCurrentEvent: (event) => set({ currentEvent: event }),
      clearEventStore: () => set({ currentEvent: null }),
    }),
    {
      name: "event-store",
    }
  )
);
