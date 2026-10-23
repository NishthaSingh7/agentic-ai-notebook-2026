import type { Metadata } from "next";
import { NotesIndex } from "@/components/notes-index";

export const metadata: Metadata = {
  title: "Notes",
  description: "Topics already studied, written up and shared. Separate from the roadmap.",
};

export default function NotesPage() {
  return <NotesIndex />;
}
