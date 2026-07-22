"use client";

import { motion } from "framer-motion";
import { roadmapFlow } from "@/data/roadmap";
import { ChevronDown } from "lucide-react";

export function RoadmapVisualization() {
  return (
    <div className="flex flex-col items-center gap-0 py-4">
      {roadmapFlow.map((step, i) => (
        <div key={step} className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative flex items-center justify-center rounded-lg border border-border bg-surface-elevated px-4 py-2 min-w-[140px] text-xs font-medium hover:border-success/30 transition-colors"
          >
            <span
              className="absolute -left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full"
              style={{
                background: i % 2 === 0 ? "#4ade80" : "#4169e1",
              }}
            />
            {step}
          </motion.div>
          {i < roadmapFlow.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 + 0.04 }}
            >
              <ChevronDown className="h-5 w-5 text-text-muted my-1" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
