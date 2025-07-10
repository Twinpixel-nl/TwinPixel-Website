// js/rss-generator.js

const fs = require('fs');
const path = require('path');

// --- PROBLEEM 1 OPGELOST ---
// Pad leest nu uit de 'blog' map, niet meer 'content/blog'
const blogIndex_PATH = path.join(__dirname, '..', 'blog', 'blog-index.json');
const RSS_FILE_PATH = path.join(__dirname, '..', 'rss.xml');
const SITE_URL = 'https://twinpixel.nl';

let posts;
try {
  posts = JSON.parse(fs.readFileSync(blogIndex_PATH, 'utf-8'));
} catch (error) {
  console.error(`❌ Kon ${blogIndex_PATH} niet lezen. Draai eerst generate-blog.js.`);
  process.exit(1); // Stop het script als het indexbestand niet bestaat
}

// Functie om de RSS feed items te genereren
const generateRssItems = (posts) => {
  let items = '';
  // De sorteerlogica zit al in generate-blog.js, dus die kan hier weg.

  posts.forEach(post => {
    // --- PROBLEEM 2 OPGELOST ---
    // We gebruiken nu post.path en niet meer post.url of post.slug
    const postUrl = `${SITE_URL}${post.path}`;
    const imageUrl = `${SITE_URL}${post.image}`;

    items += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      <enclosure url="${imageUrl}" length="0" type="image/jpeg"/>
    </item>`;
  });
  return items;
};

// De volledige RSS feed template
const rssTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>TwinPixel | Blog</title>
  <link>${SITE_URL}/blog.html</link>
  <description>De laatste blogs van TwinPixel over webdesign en ontwikkeling.</description>
  <language>nl-nl</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
  ${generateRssItems(posts)}
</channel>
</rss>`;

// Schrijf het rss.xml bestand naar de hoofdmap
try {
  fs.writeFileSync(RSS_FILE_PATH, rssTemplate.trim());
  console.log('✅ rss.xml succesvol aangemaakt met de juiste data!');
} catch (err) {
  console.error('❌ Fout bij het schrijven van rss.xml:', err);
}