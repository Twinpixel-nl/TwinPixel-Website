document.addEventListener("DOMContentLoaded", () => {
  const blogListContainer = document.getElementById("blog-list");

  // Toon een laadindicator terwijl de data wordt opgehaald
  blogListContainer.innerHTML = '<p style="color: #cbd5e1; text-align: center;">Blogposts worden geladen...</p>';

  fetch("/content/blog-index.json") // Controleer of dit pad correct is. Misschien is het /blog-index.json?
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(posts => {
      // Leeg de container voordat we de nieuwe kaarten toevoegen
      blogListContainer.innerHTML = "";

      // Sorteer posts op datum, nieuwste eerst
      const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (sortedPosts.length === 0) {
        blogListContainer.innerHTML = '<p style="color: #cbd5e1;">Er zijn nog geen blogposts gepubliceerd.</p>';
        return;
      }

      sortedPosts.forEach(post => {
        // Maak de blogkaart als een anker-tag, zodat de hele kaart klikbaar is
        const card = document.createElement("a");
        card.href = `/blog/${post.slug}.html`; // Zorg dat de URL-structuur klopt
        card.className = "blog-card";

        // Formatteer de datum netjes
        const postDate = new Date(post.date).toLocaleDateString("nl-NL", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Gebruik de nieuwe CSS-klassen voor de structuur
        card.innerHTML = `
            <img 
              src="${post.image || '/Images/uploads/default-blog-image.jpg'}" 
              alt="${post.title}" 
              class="blog-card-image" 
            />
            <div class="blog-card-content">
              <h2 class="blog-card-title">${post.title}</h2>
              <p class="blog-card-date">${postDate}</p>
              <p class="blog-card-description">${post.description}</p>
              <span class="blog-card-readmore">Lees meer</span>
            </div>
        `;
        blogListContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error("❌ Fout bij het laden van blogposts:", error);
      blogListContainer.innerHTML = `<p style="color: #ff6b6b; text-align: center;">Oeps, er ging iets mis bij het laden van de blogposts. Probeer het later opnieuw.</p>`;
    });
});