const fs = require("fs-extra"); // Gebruik fs-extra voor mkdirsSync etc.
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

// --- Configuratie Paden ---
const CONTENT_BLOG_DIR = path.resolve(__dirname, "..", "content", "blog"); // Bron Markdown bestanden
const TEMPLATE_FILE = path.resolve(__dirname, "..", "templates", "post.html"); // HTML Template voor een post
const OUTPUT_BLOG_DIR = path.resolve(__dirname, "..", "blog"); // Waar de HTML's en index komen
const BLOG_INDEX_FILE = path.join(OUTPUT_BLOG_DIR, "blog-index.json");

// --- Zorg dat output mappen bestaan ---
fs.ensureDirSync(OUTPUT_BLOG_DIR); // fs-extra maakt mappen recursief indien nodig

// --- HTML-template ophalen ---
let templateHtml;
try {
  templateHtml = fs.readFileSync(TEMPLATE_FILE, "utf8");
} catch (e) {
  console.error(`❌ Fout: Kon template bestand niet lezen op ${TEMPLATE_FILE}`);
  console.error("Zorg dat je een bestand 'templates/post.html' hebt.");
  process.exit(1); // Stop het script als template mist
}

const blogPostIndex = [];

// --- Lees alle Markdown bestanden uit de content/blog map ---
let markdownFiles;
try {
  markdownFiles = fs.readdirSync(CONTENT_BLOG_DIR).filter(file => file.endsWith(".md"));
} catch (e) {
  console.error(`❌ Fout: Kon bestanden niet lezen uit ${CONTENT_BLOG_DIR}`);
  console.error("Zorg dat de map 'content/blog' bestaat en Markdown bestanden bevat.");
  process.exit(1);
}


markdownFiles.forEach(mdFile => {
  const slug = mdFile.replace(".md", "");
  const markdownFilePath = path.join(CONTENT_BLOG_DIR, mdFile);
  const rawMarkdownContent = fs.readFileSync(markdownFilePath, "utf8");
  const { data, content } = matter(rawMarkdownContent); // data = frontmatter, content = markdown body

  // Validatie van frontmatter data
  if (!data.title || !data.description || !data.date) {
    console.warn(`⚠️  Bestand '${mdFile}' mist verplichte frontmatter velden (title, description, date) en wordt overgeslagen.`);
    return;
  }

  // Converteer Markdown body naar HTML
  const bodyHtml = marked.parse(content);

  // Probeer de eerste afbeelding als "featured image" te gebruiken als er geen expliciete is
  const firstImageMatch = bodyHtml.match(/<img[^>]+src="([^">]+)"/);
  let featuredImageHtml = "";
  let featuredImageUrl = data.image || ""; // Gebruik data.image uit frontmatter als beschikbaar

  if (!featuredImageUrl && firstImageMatch) {
      featuredImageUrl = firstImageMatch[1];
  }
  // Zorg voor een fallback image
  if (!featuredImageUrl) {
      featuredImageUrl = "/Images/uploads/default-placeholder.jpg"; // Pad naar een default image
  }
  
  // Maak HTML voor de featured image als de URL bekend is
  if (featuredImageUrl) {
    featuredImageHtml = `<img src="${featuredImageUrl}" alt="${data.title || 'Blog afbeelding'}" class="w-full rounded-xl mb-6 object-cover h-64 md:h-96" />`;
  }


  // Vervang placeholders in de template
  // De datum wordt hier direct geformatteerd voor weergave
  const postDateObject = new Date(data.date); // data.date moet ISO string zijn
  const formattedDisplayDate = !isNaN(postDateObject)
    ? postDateObject.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })
    : "Ongeldige datum";

  let finalPageHtml = templateHtml
    .replace(/%%TITLE%%/g, data.title || "Geen Titel")
    .replace(/%%DESCRIPTION%%/g, data.description || "")
    .replace(/%%DISPLAY_DATE%%/g, formattedDisplayDate) // Voor zichtbare datum
    .replace(/%%ISO_DATE%%/g, !isNaN(postDateObject) ? postDateObject.toISOString() : "") // Voor ld+json en meta
    .replace(/%%FEATURED_IMAGE_HTML%%/g, featuredImageHtml) // Featured image HTML
    .replace(/%%FEATURED_IMAGE_URL%%/g, featuredImageUrl) // Featured image URL voor meta tags
    .replace(/%%CANONICAL_URL%%/g, `https://twinpixel.nl/blog/${slug}.html`) // Update domein indien nodig
    .replace(/%%CONTENT%%/g, bodyHtml);

  // Schrijf het uiteindelijke HTML bestand
  fs.writeFileSync(path.join(OUTPUT_BLOG_DIR, `${slug}.html`), finalPageHtml);

  // Voeg toe aan de index voor blog-index.json
  blogPostIndex.push({
    title: data.title,
    description: data.description,
    image: featuredImageUrl, // Gebruik de effectief gebruikte image URL
    date: data.date, // Behoud de ISO datum voor sorteren en blog.js
    slug: slug,
    tags: data.tags || []
  });
});

// Sorteer index op datum (nieuwste eerst)
blogPostIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

// Schrijf blog-index.json
fs.writeFileSync(BLOG_INDEX_FILE, JSON.stringify(blogPostIndex, null, 2));
console.log(`✅ ${markdownFiles.length} blogposts en index succesvol gegenereerd in ${OUTPUT_BLOG_DIR}`);