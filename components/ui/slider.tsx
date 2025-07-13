"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

type SliderProps = {
  children: React.ReactNode[];
  className?: string;
};

export function Slider({ children, className }: SliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
      <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-3">
        {children.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-600 scale-100"
                : "bg-gray-200 scale-90 hover:scale-100 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
