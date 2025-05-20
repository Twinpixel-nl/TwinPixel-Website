// sitemap-generator.js
// Genereert sitemap.xml en robots.txt inclusief dynamische blogposts

const fs = require("fs");
const path = require("path");

const baseUrl = "https://twinpixel.nl";
const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
const outputDir = path.join(__dirname, "../public");
const BLOG_INDEX_FILE = path.resolve(__dirname, "../blog/blog-index.json");

// --- Statische pagina's
const staticPages = [
  { loc: "/", priority: 1.0 },
  { loc: "/about.html", priority: 0.8 },
  { loc: "/services.html", priority: 0.8 },
  { loc: "/portfolio.html", priority: 0.8 },
  { loc: "/pricing.html", priority: 0.8 },
  { loc: "/contact.html", priority: 0.8 },
  { loc: "/webdesign-wageningen.html", priority: 0.9 },
  { loc: "/blog/index.html", priority: 0.6 },
];

// --- Blogposts ophalen uit blog-index.json
function getBlogPostEntries() {
  if (!fs.existsSync(BLOG_INDEX_FILE)) {
    console.warn("⚠️ blog-index.json niet gevonden, blogposts worden niet toegevoegd aan sitemap.");
    return [];
  }

  const blogIndex = JSON.parse(fs.readFileSync(BLOG_INDEX_FILE, "utf8"));
  return blogIndex.map(post => ({
    loc: `/blog/${post.slug}.html`,
    priority: 0.6,
    lastmod: new Date(post.date).toISOString().split("T")[0],
  }));
}

const blogPages = getBlogPostEntries();
const pages = [...staticPages, ...blogPages];

// --- Genereer sitemap
function generateSitemap(pages) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const footer = `</urlset>`;

  const body = pages
    .map(
      ({ loc, priority, lastmod }) => `  <url>
    <loc>${baseUrl + loc}</loc>
    <lastmod>${lastmod || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  return `${header}\n${body}\n${footer}\n`;
}

// --- Genereer robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

User-agent: Googlebot
Crawl-delay: 5

User-agent: Bingbot
Crawl-delay: 5
`;
}

// --- Schrijf bestanden weg
fs.mkdirSync(outputDir, { recursive: true });

const sitemapXml = generateSitemap(pages);
fs.writeFileSync(path.join(outputDir, "sitemap.xml"), sitemapXml, "utf8");

const robotsTxt = generateRobotsTxt();
fs.writeFileSync(path.join(outputDir, "robots.txt"), robotsTxt, "utf8");

console.log("✅ sitemap.xml en robots.txt succesvol gegenereerd.");
