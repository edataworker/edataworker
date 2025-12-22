const logoFolder = 'logos/';
const logoFiles = [
  "logo1.png",
  "logo2.png",
  "logo3.png"
];

const gallery = document.getElementById("logoGallery");

logoFiles.forEach(file => {
  let img = document.createElement("img");
  img.src = logoFolder + file;
  gallery.appendChild(img);
});