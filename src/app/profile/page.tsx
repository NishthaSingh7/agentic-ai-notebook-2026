import type { Metadata } from "next";
import { ProfileContent } from "@/components/profile-content";

export const metadata: Metadata = {
  title: "Profile",
  description: "What you have marked complete, and the next card on the path.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
