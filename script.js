const username = "edataworker";
const repo = "mysite";
const branch = "main";

// LOGOS
loadImages("logos", "logoGallery");

// TESTIMONIALS
loadImages("testimonials", "testimonialGallery");


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
