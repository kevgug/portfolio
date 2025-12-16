/**
 * NOTE: This script is now integrated into sync-essays.mjs
 * and runs automatically. This standalone version is kept for manual use only.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentEssaysDir = path.resolve(process.cwd(), "src/content/essays");
const outputFile = path.join(contentEssaysDir, "index.json");

const files = fs.readdirSync(contentEssaysDir).filter((file) => file.endsWith(".md"));

const isProduction = process.env.NODE_ENV === "production";

let essays = files.map((file) => {
  const filePath = path.join(contentEssaysDir, file);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  const slug = file.replace(/\.md$/, "");

  // Check if essay has a config file
  const configPath = path.resolve(process.cwd(), `static/assets/essays/${slug}/config.json`);
  const hasConfig = fs.existsSync(configPath);

  return {
    slug,
    title: data.title,
    date: data.date,
    publish: data.publish,
    hasConfig,
  };
});

if (isProduction) {
  essays = essays.filter((essay) => essay.publish);
}

essays = essays
  .sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(outputFile, JSON.stringify(essays, null, 2));

console.log("✅ Successfully generated src/content/essays/index.json!");
