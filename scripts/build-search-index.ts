import { generateSearchIndex } from "../lib/search-index";

async function main() {
  console.log("[build:search] Building static search index...");
  try {
    const items = await generateSearchIndex();
    console.log(`[build:search] Successfully generated search index with ${items.length} items.`);
  } catch (err) {
    console.error("[build:search] Error generating search index:", err);
    process.exit(1);
  }
}

main();
