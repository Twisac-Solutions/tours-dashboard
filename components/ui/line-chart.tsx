"use client"

import { LineChart as RechartsLineChart, Line, XAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const data = [
  { date: '2024-04-01', value: 400,
previousValue: 300 },
  { date: '2024-04-15', value: 300,  previousValue: 400 },
  { date: '2024-04-30', value: 500,  previousValue: 450 },
  { date: '2024-05-15', value: 450,  previousValue: 350 },
]

export function LineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid vertical={false} className="stroke-gray-200 stroke-1 dark:stroke-gray-800" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => {
            const date = new Date(value)
            return `${date.getDate()}/${date.getMonth() + 1}`
          }}
          className="text-xs fill-gray-500 dark:fill-gray-500"
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="previousValue"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

