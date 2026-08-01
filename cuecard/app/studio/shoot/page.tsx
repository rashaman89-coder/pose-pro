import type { Metadata } from "next";
import { Suspense } from "react";
import ShootEditor from "@/components/studio/ShootEditor";
import { Shell } from "@/components/ui";

export const metadata: Metadata = {
  title: "Shoot",
  robots: { index: false, follow: false },
};

export default function ShootPage() {
  return (
    <Suspense fallback={<Shell className="py-16" />}>
      <ShootEditor />
    </Suspense>
  );
}
