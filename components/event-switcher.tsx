"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { axiosPrivate } from "@/lib/axios";
import { EventData } from "@/data/api";
import { useToast } from "@/hooks/use-toast";
import { useEvent } from "@/providers/EventProvider";
import Link from "next/link";
import { useEventStore } from "@/store/useEventStore";

export function EventSwitcher() {
  const { isMobile } = useSidebar();
  const [events, setEvents] = useState<EventData[]>([]);
  const { currentEvent, setCurrentEvent } = useEvent();
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/admin/event");
      setEvents(response.data.data);

      // If already has a selected event, use it

      if (response.status === 200) {
        if (currentEvent && response.data.data.length > 0) {
          return;
        }
        if (!currentEvent && response.data.data.length > 0) {
          setCurrentEvent(response.data.data[0]);
        } else if (currentEvent && response.data.data.length === 0) {
          console.log("No events found");
          useEventStore.getState().clearEventStore();
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [currentEvent, setCurrentEvent]);

  useEffect(() => {
    fetchEvents();
  }, [currentEvent, setCurrentEvent, fetchEvents]);

  const handleEventSelect = (event: EventData) => {
    setCurrentEvent(event);
    toast({
      title: "Event Switched",
      description: `Now viewing: ${event.name}`,
    });
    window.location.href = `/`;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu onOpenChange={(isOpen) => isOpen && fetchEvents()}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="sm"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <h1 className="text-primary font-bold text-2xl">
                {currentEvent ? currentEvent.name : "Events"}
              </h1>
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Events
            </DropdownMenuLabel>
            {events.map((event, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleEventSelect(event)}
                className="gap-2 p-2"
              >
                {event.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <Link
                href="/events/create"
                className="flex size-6 items-center justify-center rounded-md border bg-background"
              >
                <Plus className="size-4" />
              </Link>
              <div className="font-medium text-muted-foreground">Add Event</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
