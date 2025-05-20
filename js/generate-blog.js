const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

// Directories
const CONTENT_BLOG_DIR = path.resolve(__dirname, "..", "content", "blog");
const OUTPUT_BLOG_DIR = path.resolve(__dirname, "..", "blog");
const BLOG_INDEX_FILE = path.join(OUTPUT_BLOG_DIR, "blog-index.json");

// Zorg dat output dir bestaat
fs.ensureDirSync(OUTPUT_BLOG_DIR);

// Markdown-bestanden ophalen
const files = fs.readdirSync(CONTENT_BLOG_DIR).filter(file => file.endsWith(".md"));
const index = [];

files.forEach(file => {
  const rawContent = fs.readFileSync(path.join(CONTENT_BLOG_DIR, file), "utf-8");
  const { data, content } = matter(rawContent);

  if (!data.title || !data.date) {
    console.warn(`⚠️ Bestand '${file}' mist title of date in frontmatter en wordt overgeslagen.`);
    return;
  }

  const slug = path.basename(file, ".md");
  const htmlBodyContent = marked.parse(content);

  const postDate = new Date(data.date);
  const displayDate = !isNaN(postDate)
    ? postDate.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })
    : "Ongeldige datum";
  const isoDate = !isNaN(postDate) ? postDate.toISOString() : "";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": data.title,
    "description": data.description || data.excerpt || "",
    "image": [
      data.image || data.thumbnail || `https://twinpixel.nl/Images/default-blog-image.jpg`
    ],
    "datePublished": isoDate,
    "dateModified": data.lastmod ? new Date(data.lastmod).toISOString() : isoDate,
    "author": {
      "@type": "Person",
      "name": data.author || "TwinPixel"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TwinPixel",
      "logo": {
        "@type": "ImageObject",
        "url": "https://twinpixel.nl/Images/Logo%20donkere%20achtergrond.png"
      }
    }
  };

  const finalHtmlPage = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.title} | TwinPixel</title>
  <meta name="description" content="${data.description || data.excerpt || ""}">
  <meta property="og:title" content="${data.title}">
  <meta property="og:description" content="${data.description || data.excerpt || ""}">
  <meta property="og:image" content="${data.image || data.thumbnail || 'https://twinpixel.nl/Images/default-og-image.jpg'}">
  <meta property="og:url" content="https://twinpixel.nl/blog/${slug}.html">
  <meta property="og:type" content="article">
  <meta property="article:published_time" content="${isoDate}">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/language-switcher.css" />
  <link rel="canonical" href="https://twinpixel.nl/blog/${slug}.html">
  <script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>
</head>
<body>
  <main>
    <article>
      <h1>${data.title}</h1>
      <p class="publish-date">${displayDate}</p>
      ${data.image ? `<img src="../${data.image.startsWith('/') ? data.image.substring(1) : data.image}" alt="${data.title}" style="max-width:100%; height:auto;">` : ''}
      <div>${htmlBodyContent}</div>
    </article>
  </main>
</body>
</html>
`;

  const outputHtmlFile = path.join(OUTPUT_BLOG_DIR, `${slug}.html`);
  fs.writeFileSync(outputHtmlFile, finalHtmlPage);

  index.push({
    slug: slug,
    title: data.title,
    date: data.date,
    description: data.description || data.excerpt || "",
    image: data.image || data.thumbnail || "",
    path: `/blog/${slug}.html`
  });
});

// Sorteer index en schrijf naar bestand
index.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(BLOG_INDEX_FILE, JSON.stringify(index, null, 2));

console.log(`✅ ${files.length} blogposts en index succesvol gegenereerd.`);
