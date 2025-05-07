const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const BLOG_SRC = path.join(__dirname, "../blog");
const TEMPLATE = path.join(__dirname, "../templates/post.html");
const OUT_DIR = path.join(__dirname, "../dist/blog");
const INDEX_FILE = path.join(__dirname, "../dist/blog-index.json");

// Zorg dat output folder bestaat
fs.ensureDirSync(OUT_DIR);

// Laad template
const template = fs.readFileSync(TEMPLATE, "utf8");

// Maak blog-index array
const index = [];

const files = fs.readdirSync(BLOG_SRC).filter(f => f.endsWith(".md"));

files.forEach(file => {
  const slug = file.replace(".md", "");
  const content = fs.readFileSync(path.join(BLOG_SRC, file), "utf8");
  const { data, content: body } = matter(content);

  const htmlContent = marked(body);
  const page = template
    .replace(/%%TITLE%%/g, data.title)
    .replace(/%%DESCRIPTION%%/g, data.description)
    .replace(/%%DATE%%/g, data.date)
    .replace(/%%CONTENT%%/g, htmlContent);

  // Schrijf individuele HTML-bestand
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.html`), page);

  // Voeg toe aan index
  index.push({
    title: data.title,
    description: data.description,
    image: data.image,
    date: data.date,
    slug: slug
  });
});

// Schrijf blog-index.json
fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
console.log("✅ Blogpagina's en index gegenereerd!");
