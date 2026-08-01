import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // A couple's picks and a photographer's workspace are nobody else's
      // business, and neither has anything a search result should surface.
      disallow: ["/deck/", "/studio/"],
    },
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
