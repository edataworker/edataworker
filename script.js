const username = "YOUR_GITHUB_USERNAME";
const repo = "YOUR_REPOSITORY_NAME";
const folder = "logos";

const gallery = document.getElementById("logoGallery");

fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder}`)
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
  .catch(err => console.error("Error loading logos:", err));
