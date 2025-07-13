"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartProps {
  config: ChartConfig;
  children: ReactNode;
  className?: string;
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export function ChartContainer({ config, children, className }: ChartProps) {
  return (
    <div
      className={cn("space-y-3", className)}
      style={generateColorVariables(config)}
    >
      {children}
    </div>
  );
}

export function ChartTooltip({ content }: { content: ReactNode }) {
  return (
    <Tooltip
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          return content;
        }
        return null;
      }}
    />
  );
}

export function ChartTooltipContent({
  payload,
  formatter,
  hideLabel,
}: {
  payload?: any[];
  formatter?: (value: number, name: string) => ReactNode;
  hideLabel?: boolean;
}) {
  if (!payload) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        {payload.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between space-x-2"
          >
            {!hideLabel && (
              <div className="flex items-center space-x-2">
                <div
                  className="rounded-full border-2 border-background p-1 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}
                </span>
              </div>
            )}
            {formatter ? (
              formatter(item.value, item.name)
            ) : (
              <span className="font-bold">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function generateColorVariables(config: ChartConfig) {
  return Object.entries(config).reduce((vars, [key, value]) => {
    vars[`--color-${key}`] = value.color;
    return vars;
  }, {} as Record<string, string>);
}

export { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis };
