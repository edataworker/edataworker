const username = "edataworker";
const repo = "mysite";
const branch = "main";

// LOGOS
loadImages("logo", "logoGallery");

// TESTIMONIALS
loadImages("testimonial", "testimonialGallery");


function loadImages(folder, elementId) {
  const gallery = document.getElementById(elementId);

  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder}?ref=${branch}`)
    .then(res => res.json())
    .then(files => {
      files.forEach(file => {
        if (file.type === "file" && /\.(png|jpg|jpeg)$/i.test(file.name)) {
          const img = document.createElement("img");
          img.src = file.download_url;
          img.loading = "lazy";
          gallery.appendChild(img);
        }
      });
    })
    .catch(err => console.error("Error loading " + folder, err));
}

// IMAGE POPUP
const popup = document.getElementById("imgPopup");
const popupImg = document.getElementById("popupImage");
const closeBtn = document.querySelector(".popup-close");

document.addEventListener("click", e => {
  if (e.target.tagName === "IMG" && 
     (e.target.closest("#logoGallery") || e.target.closest("#testimonialGallery"))) {
    popup.style.display = "block";
    popupImg.src = e.target.src;
  }
});

closeBtn.onclick = () => popup.style.display = "none";
popup.onclick = e => {
  if (e.target === popup) popup.style.display = "none";
}
const blogContainer = document.getElementById("blogList");

fetch("https://api.github.com/repos/edataworker/mysite/contents/blog")
  .then(res => res.json())
  .then(files => {
    const posts = files
      .filter(f => f.type === "file" && f.name.endsWith(".html"))
      .sort((a, b) => new Date(b.name.split('-').slice(0,3).join('-')) - new Date(a.name.split('-').slice(0,3).join('-')));

    posts.forEach(file => {
      const name = file.name.replace(".html", "");
      const parts = name.split("-");
      const date = `${parts[2]}-${parts[1]}-${parts[0]}`;
      const title = parts.slice(3).join(" ").replace(/-/g, " ");

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
      <h3>${title}</h3>
      <p><small>${date}</small></p>
      <a class="cta" href="blog/${file.name}.html" target="_blank" rel="noopener">Read More</a>
`    ;

      blogContainer.appendChild(card);
    });
  })
  .catch(() => {
    blogContainer.innerHTML = "<p>Unable to load blog posts right now.</p>";
  });








