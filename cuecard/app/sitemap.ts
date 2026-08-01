import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { brand } from "@/lib/brand";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/poses", "/pricing"].map((path) => ({
    url: `${brand.url}${path}/`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // Every pose is its own landing page — this is most of the surface area.
  const posePages = catalog.map((pose) => ({
    url: `${brand.url}/poses/${pose.id}/`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // /studio and /deck are deliberately absent: one is a private workspace,
  // the other is a couple's private link.
  return [...staticPages, ...posePages];
}
