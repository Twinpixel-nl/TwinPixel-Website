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
  const htmlBodyContent = marked.parse(content); // Parsed Markdown content

  const postDate = new Date(data.date);
  const displayDate = !isNaN(postDate)
    ? postDate.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })
    : "Ongeldige datum";
  const isoDate = !isNaN(postDate) ? postDate.toISOString() : "";

  const metaDescription = data.description || data.excerpt || `Lees meer over ${data.title} op de TwinPixel blog.`;
  const ogImage = data.image || data.thumbnail || 'https://twinpixel.nl/Images/Logo%20donkere%20achtergrond.png'; // Fallback OG image

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://twinpixel.nl/blog/${slug}.html`
    },
    "headline": data.title,
    "description": metaDescription,
    "image": [
      // Zorg dat de image URL absoluut is voor structured data
      data.image ? (data.image.startsWith('http') ? data.image : `https://twinpixel.nl/${data.image.startsWith('/') ? data.image.substring(1) : data.image}`) : `https://twinpixel.nl/Images/default-blog-image.jpg`
    ],
    "datePublished": isoDate,
    "dateModified": data.lastmod ? new Date(data.lastmod).toISOString() : isoDate,
    "author": {
      "@type": "Person",
      "name": data.author || "TwinPixel",
      "url": "https://twinpixel.nl" // Optioneel: URL van de auteur
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

  // Construct de HTML voor de blogpost pagina
  // LET OP: Paden naar CSS, JS, en afbeeldingen in header/footer zijn nu relatief (../)
  const finalHtmlPage = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.title} | TwinPixel Blog</title>
  <meta name="description" content="${metaDescription}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://twinpixel.nl/blog/${slug}.html" />
  <meta property="og:title" content="${data.title} | TwinPixel Blog" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:image" content="${ogImage.startsWith('http') ? ogImage : 'https://twinpixel.nl/' + (ogImage.startsWith('/') ? ogImage.substring(1) : ogImage)}" />
  ${data.author ? `<meta property="article:author" content="${data.author}">` : ''}
  <meta property="article:published_time" content="${isoDate}">
  ${data.tags ? data.tags.map(tag => `<meta property="article:tag" content="${tag}">`).join('\n  ') : ''}


  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://twinpixel.nl/blog/${slug}.html" />
  <meta property="twitter:title" content="${data.title} | TwinPixel Blog" />
  <meta property="twitter:description" content="${metaDescription}" />
  <meta property="twitter:image" content="${ogImage.startsWith('http') ? ogImage : 'https://twinpixel.nl/' + (ogImage.startsWith('/') ? ogImage.substring(1) : ogImage)}" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://twinpixel.nl/blog/${slug}.html" />

  <!-- Stylesheets -->
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/language-switcher.css" />

  <!-- Font Awesome for icons -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
  />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />

  <!-- Fav icons -->
  <link rel="apple-touch-icon" sizes="180x180" href="../Icons/apple-touch-icon.png"/>
  <link rel="icon" type="image/png" sizes="32x32" href="../Icons/favicon-32x32.png"/>
  <link rel="icon" type="image/png" sizes="16x16" href="../Icons/favicon-16x16.png"/>
  <link rel="manifest" href="../site.webmanifest" />

  <!-- Structured Data -->
  <script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>
  
  <!-- Google Tag Manager (Let op: paden kunnen hier ook aangepast moeten worden als GTM files lokaal zijn) -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-WGPWS2SM');</script>
  <!-- End Google Tag Manager -->
</head>
<body class="dark-bg"> <!-- Voeg dark-bg toe als je dat standaard wilt -->
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WGPWS2SM"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <!-- Mobile Menu Overlay -->
  <div class="mobile-menu-overlay"></div>

  <!-- Header -->
  <header>
    <div class="container">
      <nav class="navbar">
        <a href="../index.html" class="logo-container">
          <img
            src="../Images/Logo donkere achtergrond.png"
            alt="TwinPixel Logo"
            class="logo"
          />
        </a>
        <ul class="nav-links">
          <li><a href="../index.html" data-i18n="common.nav_home">Home</a></li>
          <li><a href="../about.html" data-i18n="common.nav_about">Over ons</a></li>
          <li><a href="../services.html" data-i18n="common.nav_services">Diensten</a></li>
          <li><a href="../portfolio.html" data-i18n="common.nav_portfolio">Portfolio</a></li>
          <li><a href="../pricing.html" data-i18n="common.nav_pricing">Prijzen</a></li>
          <li><a href="../contact.html" data-i18n="common.nav_contact">Contact</a></li>
          <!-- Overweeg een 'Blog' link hier, die naar ../blog.html wijst en 'active' is -->
        </ul>
        <div class="language-switcher">
          <div class="language-buttons">
            <a href="#nl" class="lang-btn active">NL</a>
            <a href="#en" class="lang-btn">EN</a>
          </div>
        </div>
        <button class="mobile-menu-btn" aria-label="Toggle menu">
          <i class="fas fa-bars"></i>
        </button>
      </nav>
    </div>
  </header>

  <!-- Blog Post Specifiek deel -->
  <section class="page-header blog-post-header">
    <div class="container">
      <h1 class="fade-in">${data.title}</h1>
      <p class="publish-date">${displayDate}</p>
      ${data.author ? `<p class="author-name">Door: ${data.author}</p>` : ''}
    </div>
  </section>

  <main class="container blog-post-page-container">
    <article class="blog-post-full">
      ${data.image ? `<img src="../${data.image.startsWith('/') ? data.image.substring(1) : data.image}" alt="${data.title}" class="blog-post-full-image">` : ''}
      <div class="blog-post-full-content">
        ${htmlBodyContent}
      </div>
    </article>
  </main>

  <!-- Footer -->
  <footer>
    <div class="container">
      <img src="../Images/Logo donkere achtergrond.png" alt="TwinPixel Footer Logo" class="footer-logo" />
      <ul class="footer-links">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../about.html">Over ons</a></li>
        <li><a href="../services.html">Diensten</a></li>
        <li><a href="../portfolio.html">Portfolio</a></li>
        <li><a href="../pricing.html">Prijzen</a></li>
        <li><a href="../contact.html">Contact</a></li>
      </ul>
      <ul class="social-links">
        <li><a href="https://www.facebook.com/profile.php?id=61574036669497" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a></li>
        <li><a href="https://www.instagram.com/twinpixel.nl/" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a></li>
        <li><a href="https://www.linkedin.com/company/twinpixel/" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a></li>
      </ul>
      <p class="copyright">© ${new Date().getFullYear()} TwinPixel. Alle rechten voorbehouden.</p>
    </div>
  </footer>

  <script src="../js/main.js"></script>
  <!-- <script src="../js/blog.js"></script>  Mogelijk niet nodig op de detailpagina -->
  <!-- Voeg hier specifieke JS voor taalwisseling toe als die niet in main.js zit -->
</body>
</html>
`;

  const outputHtmlFile = path.join(OUTPUT_BLOG_DIR, `${slug}.html`);
  fs.writeFileSync(outputHtmlFile, finalHtmlPage);

  index.push({
    slug: slug,
    title: data.title,
    date: data.date, // Houd de oorspronkelijke datum voor sortering
    displayDate: displayDate, // Toonbare datum voor de bloglijst
    description: data.description || data.excerpt || "",
    image: data.image || data.thumbnail || "", // Pad relatief aan de content map of leeg
    path: `/blog/${slug}.html` // Pad voor de link
  });
});

// Sorteer index en schrijf naar bestand
index.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(BLOG_INDEX_FILE, JSON.stringify(index, null, 2));

console.log(`✅ ${files.length} blogposts en index succesvol gegenereerd.`);