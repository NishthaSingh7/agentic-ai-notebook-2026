/**
 * Component-level pastel palette — one color per logical group in a diagram,
 * not per individual box.
 */
export const MERMAID_PASTEL_DEFS = `    classDef hub fill:#fef9c3,stroke:#eab308,color:#713f12,stroke-width:2px
    classDef grp1 fill:#ffedd5,stroke:#fb923c,color:#9a3412,stroke-width:2px
    classDef grp2 fill:#ede9fe,stroke:#a78bfa,color:#5b21b6,stroke-width:2px
    classDef grp3 fill:#dbeafe,stroke:#60a5fa,color:#1e40af,stroke-width:2px
    classDef grp4 fill:#dcfce7,stroke:#4ade80,color:#166534,stroke-width:2px
    classDef grp5 fill:#fce7f3,stroke:#f472b6,color:#9d174d,stroke-width:2px`;

const RESERVED_IDS = new Set([
  "subgraph",
  "end",
  "flowchart",
  "graph",
  "TD",
  "LR",
  "BT",
  "RL",
  "class",
  "classDef",
  "style",
]);

const SUBGRAPH_FILL = [
  "fill:#fff7ed,stroke:#fdba74,color:#9a3412",
  "fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6",
  "fill:#eff6ff,stroke:#93c5fd,color:#1e40af",
  "fill:#ecfdf5,stroke:#6ee7b7,color:#065f46",
  "fill:#fdf2f8,stroke:#f9a8d4,color:#9d174d",
];

/** Append shared pastel class definitions to a Mermaid chart */
export function pastelChart(body: string, classAssignments = ""): string {
  const trimmed = body.trim();
  if (!classAssignments.trim()) {
    return `${trimmed}\n\n${MERMAID_PASTEL_DEFS}`;
  }
  return `${trimmed}\n\n${MERMAID_PASTEL_DEFS}\n${classAssignments.trim()}`;
}

function extractNodeIds(body: string): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const match of body.matchAll(/^\s*(\w+)\s*(?:\[|\(|\{)/gm)) {
    const id = match[1];
    if (!RESERVED_IDS.has(id) && !seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }
  return ids;
}

function parseSubgraphs(chart: string) {
  const results: { id: string; nodes: string[] }[] = [];
  const regex = /subgraph\s+(\w+)(?:\[[^\]]*\])?[^\n]*\n([\s\S]*?)\n\s*end/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(chart)) !== null) {
    results.push({
      id: match[1],
      nodes: extractNodeIds(match[2]),
    });
  }
  return results;
}

function isHubNode(chart: string, id: string): boolean {
  return new RegExp(`\\b${id}\\s*\\(`).test(chart);
}

/**
 * Auto-apply one pastel color per subgraph (or per logical group).
 * Skips charts that already define pastel classes.
 */
export function autoPastelChart(chart?: string): string | undefined {
  if (!chart?.trim()) return chart;
  if (chart.includes("classDef grp1")) return chart;

  const subgraphs = parseSubgraphs(chart);
  const assignments: string[] = [];
  const styleLines: string[] = [];
  const groupedNodes = new Set<string>();

  subgraphs.forEach((subgraph, index) => {
    const grp = `grp${(index % 5) + 1}`;
    subgraph.nodes.forEach((node) => groupedNodes.add(node));
    if (subgraph.nodes.length > 0) {
      assignments.push(`class ${subgraph.nodes.join(",")} ${grp}`);
    }
    styleLines.push(`style ${subgraph.id} ${SUBGRAPH_FILL[index % SUBGRAPH_FILL.length]}`);
  });

  const topLevelNodes = extractNodeIds(chart).filter((id) => !groupedNodes.has(id));
  const hubNodes = topLevelNodes.filter((id) => isHubNode(chart, id));
  const regularNodes = topLevelNodes.filter((id) => !hubNodes.includes(id));

  if (hubNodes.length > 0) {
    assignments.push(`class ${hubNodes.join(",")} hub`);
  }

  if (regularNodes.length > 0) {
    if (subgraphs.length === 0 && regularNodes.length > 3) {
      const mid = Math.ceil(regularNodes.length / 2);
      assignments.push(`class ${regularNodes.slice(0, mid).join(",")} grp1`);
      assignments.push(`class ${regularNodes.slice(mid).join(",")} grp2`);
    } else {
      assignments.push(`class ${regularNodes.join(",")} grp1`);
    }
  }

  return pastelChart(chart, [...assignments, ...styleLines].join("\n    "));
}
