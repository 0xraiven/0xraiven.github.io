import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://0xraiven.github.io";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keystatic/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
