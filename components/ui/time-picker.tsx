"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const times = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

interface TimePickerProps {
  value: string | null;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

export function TimePicker({
  value,
  onChange,
  required = false,
  placeholder = "Select Time",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleBlur = () => {
    if (required && !value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            onBlur={handleBlur}
          >
            {value
              ? format(new Date(`2024-01-01T${value}:00`), "h:mm a")
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-2 space-y-1">
          {times.map((time) => (
            <Button
              key={time}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => {
                onChange(time);
                setOpen(false);
                setError(false); // Clear error on selection
              }}
            >
              {format(new Date(`2024-01-01T${time}:00`), "h:mm a")}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-xs mt-1">Time is required</p>}
    </div>
  );
}
