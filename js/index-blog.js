// Index Blog Section Handler
document.addEventListener("DOMContentLoaded", () => {
  const blogSection = document.getElementById("index-blog-section");
  
  if (!blogSection) {
    console.log("Blog section not found on this page");
    return;
  }

  fetch("/blog/blog-index.json")
    .then(response => response.json())
    .then(posts => {
      if (posts.length === 0) {
        // Hide the section if no posts
        blogSection.style.display = "none";
        return;
      }

      // Show only the first 2 posts
      const postsToShow = posts.slice(0, 2);
      const blogGrid = document.getElementById("index-blog-grid");

      postsToShow.forEach(post => {
        const blogCard = document.createElement("article");
        blogCard.className = "blog-card fade-in";
        
        // Create the blog post URL - handle both cases where post might have 'url' or need to construct from slug
        const postUrl = post.url || `blog/${post.slug}.html`;
        
        blogCard.innerHTML = `
          <a href="${postUrl}" class="blog-card-link">
            <img src="${post.image || 'Images/uploads/placeholder.jpg'}" alt="${post.title}" class="blog-card-image" />
            <div class="blog-card-content">
              <h3 class="blog-card-title">${post.title}</h3>
              <p class="blog-card-date">${new Date(post.date).toLocaleDateString("nl-NL", {
                year: "numeric", 
                month: "long", 
                day: "numeric"
              })}</p>
              <p class="blog-card-description">${post.description}</p>
            </div>
          </a>
        `;
        
        blogGrid.appendChild(blogCard);
      });

      // Show the section
      blogSection.style.display = "block";
    })
    .catch(error => {
      console.error("❌ Fout bij het laden van blogposts voor index:", error);
      // Hide the section on error
      blogSection.style.display = "none";
    });
});
