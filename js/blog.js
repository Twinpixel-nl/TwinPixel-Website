document.addEventListener("DOMContentLoaded", () => {
  const blogListContainer = document.getElementById("blog-list");

  // Toon een laadindicator voor een betere gebruikerservaring
  if (blogListContainer) {
    blogListContainer.innerHTML = '<p style="color: #cbd5e1; text-align: center; width: 100%;">Blogposts worden geladen...</p>';
  }

  // Haal de blogposts op uit het JSON-bestand
  fetch("/blog/blog-index.json") // Controleer of dit pad correct is voor jouw projectstructuur
    .then(response => {
      if (!response.ok) {
        throw new Error(`Netwerkfout: ${response.statusText}`);
      }
      return response.json();
    })
    .then(posts => {
      if (!blogListContainer) return;

      // Leeg de laadindicator
      blogListContainer.innerHTML = "";

      // Sorteer de posts op datum, met de nieuwste eerst
      const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Toon een bericht als er geen posts zijn
      if (sortedPosts.length === 0) {
        blogListContainer.innerHTML = '<p style="color: #cbd5e1;">Er zijn nog geen blogposts gepubliceerd.</p>';
        return;
      }

      // Genereer voor elke post een kaart met de nieuwe structuur en klassen
      sortedPosts.forEach(post => {
        // De hele kaart is nu een klikbare link (<a>-tag)
        const card = document.createElement("a");
        card.href = `/blog/${post.slug}.html`; // Zorg dat dit pad klopt
        card.className = "blog-card"; // Gebruik de nieuwe hoofdklasse

        // Formatteer de datum voor weergave
        const displayDate = new Date(post.date).toLocaleDateString("nl-NL", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        // Vul de kaart met de juiste HTML-structuur en klassen uit blog-overview.css
        card.innerHTML = `
          <img 
            src="${post.image || '/Images/uploads/default-blog-image.jpg'}" 
            alt="${post.title}" 
            class="blog-card-image"
            onerror="this.onerror=null;this.src='/Images/uploads/default-blog-image.jpg';"
          />
          <div class="blog-card-content">
            <h2 class="blog-card-title">${post.title}</h2>
            <p class="blog-card-date">${displayDate}</p>
            <p class="blog-card-description">${post.description}</p>
            <span class="blog-card-readmore">Lees meer</span>
          </div>
        `;
        
        blogListContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error("❌ Fout bij het laden van blogposts:", error);
      if (blogListContainer) {
        blogListContainer.innerHTML = `<p style="color: #ff6b6b; text-align: center;">Oeps, er ging iets mis. De blogposts konden niet worden geladen.</p>`;
      }
    });
});