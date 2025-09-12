import fs from "fs";
import path from "path";
import matter from "gray-matter";

const essaysDir = path.resolve(process.cwd(), "static/essays");
const outputFile = path.join(essaysDir, "index.json");

const files = fs.readdirSync(essaysDir).filter((file) => file.endsWith(".md"));

const isProduction = process.env.NODE_ENV === "production";

let essays = files.map((file) => {
  const filePath = path.join(essaysDir, file);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);

  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    date: data.date,
    publish: data.publish,
  };
});

if (isProduction) {
  essays = essays.filter((essay) => essay.publish);
}

essays = essays
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map((essay) => {
    delete essay.publish;
    return essay;
  });

fs.writeFileSync(outputFile, JSON.stringify(essays, null, 2));

console.log("✅ Successfully generated essays/index.json!");
