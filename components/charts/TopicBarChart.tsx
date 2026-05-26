"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { topic: string; wrongCount: number }[];
}

export default function TopicBarChart({ data }: Props) {
  return (
    <div className="bg-plate border border-rule ind-surface">
      <div className="border-b border-rule px-4 py-2">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          TOPIC WEAKNESS MAP
        </span>
      </div>
      <div className="px-4 py-4">
        {data.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted">
              NO WEAKNESS DATA RECORDED.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border-faint)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 9, fontFamily: "var(--font-jetbrains)", fill: "var(--fg-muted)" }}
              />
              <YAxis
                dataKey="topic"
                type="category"
                tick={{ fontSize: 9, fontFamily: "var(--font-jetbrains)", fill: "var(--fg-muted)", textTransform: "uppercase" }}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 0,
                  fontSize: 10,
                  fontFamily: "var(--font-jetbrains)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              />
              <Bar dataKey="wrongCount" fill="var(--accent)" name="WRONG ANSWERS" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
