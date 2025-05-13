const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

// Voor toegang tot /blog vanuit /js/
const BLOG_DIR = path.resolve(__dirname, "../blog");
const TEMPLATE_FILE = path.resolve(__dirname, "../templates/post.html");

const INDEX_FILE = path.join(BLOG_DIR, "blog-index.json");

// HTML-template ophalen
const template = fs.readFileSync(TEMPLATE_FILE, "utf8");

// Index array voor JSON
const index = [];

fs.readdirSync(BLOG_DIR).forEach(file => {
  if (!file.endsWith(".md")) return;

  const slug = file.replace(".md", "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);

  // Validatie: sla over als essentiële data ontbreekt
  if (!data.title || !data.description || !data.date) {
    console.warn(`⚠️  Bestand '${file}' mist verplichte velden en wordt overgeslagen.`);
    return;
  }

  const html = marked(content);

  // Eerste afbeelding eruit halen
  const firstImageMatch = html.match(/<img[^>]+src="([^">]+)"/);
  const firstImageHTML = firstImageMatch ? `<img src="${firstImageMatch[1]}" alt="Featured Image" class="w-full rounded-xl mb-6" />` : "";
  
  // Content met afbeelding erboven
  const fullHtml = `${firstImageHTML}${html}`;
  

  const page = template
    .replace(/%%TITLE%%/g, data.title)
    .replace(/%%DESCRIPTION%%/g, data.description)
    .replace(/%%DATE%%/g, data.date)
    .replace(/%%CONTENT%%/g, fullHtml);


  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.html`), page);

  index.push({
    title: data.title,
    description: data.description,
    image: data.image || "",
    date: data.date,
    slug: slug,
    tags: data.tags || []
  });
});


// Schrijf blog-index.json
fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
console.log("✅ Blogposts en index succesvol gegenereerd in blog/");
