"use client";

import { motion } from "framer-motion";
import { roadmapFlow } from "@/data/roadmap";
import { ChevronDown, ChevronRight } from "lucide-react";

function FlowStep({ step, index }: { step: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="relative flex flex-1 items-center justify-center rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs font-medium hover:border-success/30 transition-colors text-center min-h-[36px] min-w-0"
    >
      <span
        className="absolute -left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full"
        style={{
          background: index % 2 === 0 ? "#4ade80" : "#4169e1",
        }}
      />
      {step}
    </motion.div>
  );
}

export function RoadmapVisualization() {
  const rows: string[][] = [];
  for (let i = 0; i < roadmapFlow.length; i += 2) {
    rows.push(roadmapFlow.slice(i, i + 2));
  }

  return (
    <div className="flex w-full flex-col items-center gap-1 py-2">
      {rows.map((row, rowIndex) => {
        const baseIndex = rowIndex * 2;
        const hasPair = row.length > 1;

        return (
          <div key={rowIndex} className="flex w-full max-w-xl flex-col items-center">
            <div
              className={`flex w-full items-center gap-2 ${hasPair ? "" : "max-w-[calc(50%-0.25rem)]"}`}
            >
              <FlowStep step={row[0]} index={baseIndex} />
              {hasPair && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: baseIndex * 0.04 + 0.02 }}
                    className="shrink-0"
                  >
                    <ChevronRight className="h-4 w-4 text-text-muted" />
                  </motion.div>
                  <FlowStep step={row[1]} index={baseIndex + 1} />
                </>
              )}
            </div>

            {rowIndex < rows.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: baseIndex * 0.04 + 0.03 }}
                className="my-0.5"
              >
                <ChevronDown className="h-4 w-4 text-text-muted" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
