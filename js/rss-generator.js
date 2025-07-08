// js/rss-generator.js

const fs = require('fs');
const path = require('path');

// Pad naar de bron-JSON en het doel-XML-bestand
const blogIndex_PATH = path.join(__dirname, '..', 'content', 'blog', 'blog-index.json');
const RSS_FILE_PATH = path.join(__dirname, '..', 'rss.xml');
const SITE_URL = 'https://twinpixel.nl';

// Lees de blog index JSON
const posts = JSON.parse(fs.readFileSync(blogIndex_PATH, 'utf-8'));

// Functie om de RSS feed items te genereren
const generateRssItems = (posts) => {
  let items = '';
  posts.forEach(post => {
    // BELANGRIJK: Pas de veldnamen hieronder aan jouw blog-index.json!
    const postUrl = `${SITE_URL}/${post.url}`; // Dit is de JUISTE regel
    const imageUrl = `${SITE_URL}${post.image}`; // Zorg dat het pad naar de afbeelding klopt

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
  <link>${SITE_URL}/blog</link>
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
  console.log('✅ rss.xml succesvol aangemaakt!');
} catch (err) {
  console.error('❌ Fout bij het schrijven van rss.xml:', err);
}