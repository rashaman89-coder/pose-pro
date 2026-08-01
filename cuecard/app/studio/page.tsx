import type { Metadata } from "next";
import StudioDashboard from "@/components/studio/StudioDashboard";

export const metadata: Metadata = {
  title: "Studio",
  description: "Your shoots, pose plans and shot lists.",
  robots: { index: false, follow: true },
};

export default function StudioPage() {
  return <StudioDashboard />;
}
