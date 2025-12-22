const username = "edataworker";
const repo = "mysite";
const folder = "mysite\logs";

const gallery = document.getElementById("logoGallery");

fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder}`)
  .then(res => res.json())
  .then(files => {
    files.forEach(file => {
      if (file.type === "file" && /\.(png|jpg|jpeg)$/i.test(file.name)) {
        const img = document.createElement("img");
        img.src = file.download_url;
        gallery.appendChild(img);
      }
    });
  })
  .catch(err => console.error("Error loading logos:", err));




