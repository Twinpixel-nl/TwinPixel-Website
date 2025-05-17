// BOVENAAN JE generate-blog.js (je hebt dit al, alleen de 'files.forEach' loop wordt aangepast)
// ... (fs, path, matter, marked, glob, mappen definities, etc. blijven hetzelfde) ...

files.forEach(file => {
  const rawContent = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(rawContent); // data = frontmatter

  // Valideer essentiële frontmatter velden
  if (!data.title || !data.date) { // Minimaal titel en datum nodig
    console.warn(`⚠️  Bestand '${file}' mist title of date in frontmatter en wordt overgeslagen.`);
    return;
  }

  // Slug generatie (houd het simpel voor nu: bestandsnaam zonder .md)
  // Als je /content/blog/categorie/post.md hebt, wordt dit 'post'
  // Als je /content/blog/post.md hebt, wordt dit 'post'
  const slug = path.basename(file, ".md");

  const htmlBodyContent = marked.parse(content); // Converteer Markdown body naar HTML

  // Datumverwerking
  const postDate = new Date(data.date); // data.date MOET een ISO 8601 string zijn
  const displayDate = !isNaN(postDate)
    ? postDate.toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })
    : "Ongeldige datum";
  const isoDate = !isNaN(postDate) ? postDate.toISOString() : "";

  // Structured Data voor SEO (JSON-LD)
  // Zorg dat 'data.image' (of 'data.thumbnail') het volledige pad vanaf de root is, bv. /Images/uploads/jouw-afbeelding.jpg
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": data.title,
    "description": data.description || data.excerpt || "", // Gebruik description, fallback naar excerpt
    "image": [
      data.image || data.thumbnail || `https://twinpixel.nl/Images/default-blog-image.jpg` // Volledige URL naar een default
    ],
    "datePublished": isoDate,
    "dateModified": data.lastmod ? new Date(data.lastmod).toISOString() : isoDate, // Optioneel: als je een 'lastmod' veld hebt
    "author": {
      "@type": "Person", // Veranderd naar Person voor TwinPixel
      "name": data.author || "TwinPixel" // Haal auteur uit frontmatter indien beschikbaar
    },
    "publisher": {
      "@type": "Organization",
      "name": "TwinPixel", // Jouw bedrijfsnaam
      "logo": {
        "@type": "ImageObject",
        "url": "https://twinpixel.nl/Images/Logo%20donkere%20achtergrond.png" // Volledige URL
      }
    }
  };

  // De volledige HTML-output voor deze blogpost
  // LET OP DE PADEN VOOR CSS/JS/IMAGES: `../` omdat de output in /blog/ komt
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

  <!-- Stylesheets (let op paden: ../) -->
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/language-switcher.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

  <!-- Favicons (let op paden: ../) -->
  <link rel="apple-touch-icon" sizes="180x180" href="../Icons/apple-touch-icon.png"/>
  <link rel="icon" type="image/png" sizes="32x32" href="../Icons/favicon-32x32.png"/>
  <link rel="icon" type="image/png" sizes="16x16" href="../Icons/favicon-16x16.png"/>
  <link rel="manifest" href="../manifest.json"/> 

  <link rel="canonical" href="https://twinpixel.nl/blog/${slug}.html">

  <script type="application/ld+json">
  ${JSON.stringify(structuredData, null, 2)}
  </script>
</head>
<body>

  <header>
    <div class="container">
      <nav class="navbar">
        <a href="../index.html" class="logo-container">
          <img src="../Images/Logo donkere achtergrond.png" alt="TwinPixel Logo" class="logo"/>
        </a>
        <ul class="nav-links">
          <li><a href="../index.html" data-i18n="common.nav_home">Home</a></li>
          <li><a href="../about.html" data-i18n="common.nav_about">Over ons</a></li>
          <li><a href="../services.html" data-i18n="common.nav_services">Diensten</a></li>
          <li><a href="../portfolio.html" data-i18n="common.nav_portfolio">Portfolio</a></li>
          <li><a href="../pricing.html" data-i18n="common.nav_pricing">Prijzen</a></li>
          <li><a href="../contact.html" data-i18n="common.nav_contact">Contact</a></li>
        </ul>
        <div class="language-switcher">
          <div class="language-buttons">
            <a href="#nl" class="lang-btn active">NL</a>
            <a href="#en" class="lang-btn">EN</a>
          </div>
        </div>
        <button class="mobile-menu-btn" aria-label="Toggle menu"><i class="fas fa-bars"></i></button>
      </nav>
    </div>
  </header>

  <main>
    <section class="page-header">
      <div class="container">
        <!-- Titel van de blogpost zelf is prominenter -->
      </div>
    </section>

    <section class="about-section"> <!-- Of geef het een class als 'blog-post-detail-section' -->
      <div class="container">
        <div class="about-vision-section fade-in delay-1"> <!-- Of 'blog-post-wrapper' -->
          <div class="service-card-glass about-card"> <!-- Of 'blog-post-card' -->
            <article>
              <h1 class="section-title">${data.title}</h1>
              <p class="blog-post-meta">
                Gepubliceerd op: <span class="publish-date">${displayDate}</span>
              </p>
              <section class="blog-post-content">
                ${data.image ? `<img src="../${data.image.startsWith('/') ? data.image.substring(1) : data.image}" alt="${data.title}" class="blog-post-featured-image" style="max-width:100%; height:auto; margin-bottom:20px; border-radius:8px;">` : ''}
                ${htmlBodyContent}
              </section>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <img src="../Images/Logo donkere achtergrond.png" alt="TwinPixel Footer Logo" class="footer-logo"/>
      <ul class="footer-links">
        <li><a href="../index.html" data-i18n="common.nav_home">Home</a></li>
        <li><a href="../about.html" data-i18n="common.nav_about">Over ons</a></li>
        <li><a href="../services.html" data-i18n="common.nav_services">Diensten</a></li>
        <li><a href="../portfolio.html" data-i18n="common.nav_portfolio">Portfolio</a></li>
        <li><a href="../pricing.html" data-i18n="common.nav_pricing">Prijzen</a></li>
        <li><a href="../contact.html" data-i18n="common.nav_contact">Contact</a></li>
      </ul>
      <ul class="social-links">
        <li><a href="https://www.facebook.com/profile.php?id=61574036669497" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a></li>
        <li><a href="https://www.instagram.com/twinpixel.nl/" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a></li>
        <li><a href="https://www.linkedin.com/company/twinpixel/" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a></li>
      </ul>
      <p class="copyright" data-i18n="common.copyright">© ${new Date().getFullYear()} TwinPixel. Alle rechten voorbehouden.</p>
    </div>
  </footer>

  <script src="../js/main.js"></script>
  <!-- GEEN apart client-side datumformatteringsscript meer nodig hier! -->
</body>
</html>
`;

  // Schrijf HTML bestand
  const outputHtmlFile = path.join(outputDir, `${slug}.html`);
  fs.writeFileSync(outputHtmlFile, finalHtmlPage);

  // Voeg toe aan blog-index voor je blog overzichtspagina (blog.js)
  index.push({
    slug: slug, // Voor de link in blog.js
    title: data.title,
    date: data.date, // De originele ISO datum voor sorteren en client-side formattering in blog.js
    description: data.description || data.excerpt || "",
    image: data.image || data.thumbnail || "", // Pad naar de afbeelding
    path: `/blog/${slug}.html` // Pad voor de link in blog.js
  });
});

// ... (rest van je script: index.sort en fs.writeFileSync voor indexFile blijven hetzelfde) ...
// index.sort((a, b) => new Date(b.date) - new Date(a.date));
// fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
// console.log("✅ Blogpagina's en index gegenereerd.");