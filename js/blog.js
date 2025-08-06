document.addEventListener("DOMContentLoaded", () => {
  const blogListContainer = document.getElementById("blog-list");

  if (blogListContainer) {
    blogListContainer.innerHTML = '<p style="color: #cbd5e1; text-align: center; width: 100%;">Blogposts worden geladen...</p>';
  }

  fetch("/blog/blog-index.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Netwerkfout: ${response.statusText}`);
      }
      return response.json();
    })
    .then(posts => {
      if (!blogListContainer) return;
      blogListContainer.innerHTML = "";

      const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (sortedPosts.length === 0) {
        blogListContainer.innerHTML = '<p style="color: #cbd5e1;">Er zijn nog geen blogposts gepubliceerd.</p>';
        return;
      }

      sortedPosts.forEach(post => {
        const card = document.createElement("a");
        card.href = `/blog/${post.slug}.html`;
        card.className = "blog-card";

        const displayDate = new Date(post.date).toLocaleDateString("nl-NL", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        // === AANGEPASTE HTML STRUCTUUR ===
        // Volgt nu de nieuwe, cleanere opbouw.
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