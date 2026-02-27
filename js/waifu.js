// 图层顺序（从底到顶）
const layers = [
  "body",
  "coat",
  "board",
  "hair back",
  "ear left",
  "ear right",
  "face",
  "eye down",
  "eyeup",
  "eyeball",
  "eye closen",
  "meimao",
  "mouth open",
  "glass",
  "hair front black",
  "hair front1",
  "hair right",
  "hat",
  "arm down",
  "arm up",
  "hand",
  "star left",
  "star right",
  "tear",
  "sad",
  "mad"
];

const container = document.querySelector(".model");

// 自动加载图片
layers.forEach((name, index) => {
  const img = document.createElement("img");

  img.src = `/img/pngtuber/${name}.png`;
  img.style.zIndex = index + 1;
  img.id = name.replace(/\s/g, "_");

  img.style.position = "absolute";
  img.style.width = "100%";

  container.appendChild(img);
});

// 👀 鼠标跟随（只动眼球）
document.addEventListener("mousemove", (e) => {
  const eye = document.getElementById("eyeball");
  if (!eye) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;

  eye.style.transform = `translate(${x}px, ${y}px)`;
});

// 😉 自动眨眼
setInterval(() => {
  const eyeClose = document.getElementById("eye_closen");
  if (!eyeClose) return;

  eyeClose.style.display = "block";

  setTimeout(() => {
    eyeClose.style.display = "none";
  }, 200);
}, 3000);