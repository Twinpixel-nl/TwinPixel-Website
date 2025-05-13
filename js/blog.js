document.addEventListener("DOMContentLoaded", () => {
  fetch("blog/blog-index.json")
    .then(response => response.json())
    .then(posts => {
      const list = document.getElementById("blog-list");

      posts.forEach(post => {
        const card = document.createElement("article");
        card.className = "unique-card";
        card.innerHTML = `
          <a href="blog/${post.slug}.html" class="unique-card-inner">
            <img src="${post.image || 'Images/uploads/placeholder.jpg'}" alt="${post.title}" class="w-full object-cover h-48 rounded-t-[20px]" />
            <div class="p-6">
              <h2 class="text-xl font-semibold text-white mb-2">${post.title}</h2>
              <p class="text-sm text-blue-400 mb-2">${new Date(post.date).toLocaleDateString("nl-NL", {
                year: "numeric", month: "long", day: "numeric"
              })}</p>
              <p class="text-base text-gray-300">${post.description}</p>
            </div>
          </a>
        `;
        list.appendChild(card);
      });
    })
    .catch(error => {
      console.error("❌ Fout bij het laden van blogposts:", error);
      const list = document.getElementById("blog-list");
      list.innerHTML = `<p class="text-red-500">Kan blogposts niet laden.</p>`;
    });
});
