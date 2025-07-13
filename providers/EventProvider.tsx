"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { EventData } from "@/data/api";
import { useEventStore } from "@/store/useEventStore";

interface EventContextType {
  currentEvent: EventData | null;
  setCurrentEvent: (event: EventData) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const { currentEvent, setCurrentEvent } = useEventStore();

  useEffect(() => {
    // Load from Zustand on mount
    if (!currentEvent) {
      // Fetch or set default event here if needed
    }
  }, [currentEvent, setCurrentEvent]);

  return (
    <EventContext.Provider value={{ currentEvent, setCurrentEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
