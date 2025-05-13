document.addEventListener("DOMContentLoaded", () => {
  const blogList = document.getElementById("blog-list");
  const filterContainer = document.getElementById("blog-filters");
  let allPosts = [];

  fetch("blog/blog-index.json")
    .then(res => res.json())
    .then(posts => {
      allPosts = posts;
      renderFilters(posts);
      renderPosts(posts);
      observeFadeIns();
    });

  function renderFilters(posts) {
    const uniqueTags = new Set();
    posts.forEach(post => {
      (post.tags || []).forEach(tag => uniqueTags.add(tag));
    });

    const allButton = document.createElement("button");
    allButton.innerText = "Alles";
    allButton.className = "filter-button active";
    allButton.addEventListener("click", () => {
      setActiveFilter(allButton);
      renderPosts(allPosts);
    });
    filterContainer.appendChild(allButton);

    uniqueTags.forEach(tag => {
      const btn = document.createElement("button");
      btn.innerText = tag;
      btn.className = "filter-button";
      btn.addEventListener("click", () => {
        setActiveFilter(btn);
        const filtered = allPosts.filter(p => p.tags && p.tags.includes(tag));
        renderPosts(filtered);
      });
      filterContainer.appendChild(btn);
    });
  }

  function setActiveFilter(activeBtn) {
    document.querySelectorAll(".filter-button").forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  function renderPosts(posts) {
    blogList.innerHTML = "";
    posts.forEach(post => {
      const card = document.createElement("article");
      card.className = "blog-card fade-in";
      card.innerHTML = `
        <a href="blog/${post.slug}.html" class="block rounded-2xl overflow-hidden bg-[#1e293b] hover:shadow-lg transition">
          <img src="${post.image || 'Images/uploads/placeholder.jpg'}" alt="${post.title}" class="w-full h-48 object-cover" />
          <div class="p-6">
            <h2 class="text-xl font-bold text-white line-clamp-2">${post.title}</h2>
            <p class="text-sm text-blue-400 mt-1 mb-2">${post.date}</p>
            <p class="text-gray-300 line-clamp-3">${post.description}</p>
          </div>
        </a>
      `;
      blogList.appendChild(card);
    });
  }

  function observeFadeIns() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("fade-in-visible");
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
  }
});
