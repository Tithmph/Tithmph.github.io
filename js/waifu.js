// 图层顺序（从底到顶）
const layers = [
  "body",
  "coat",
  "board",
  "hair_back",
  "ear_left",
  "ear_right",
  "face",
  "eye_down",
  "eyeup",
  "eyeball",
  "eye_closen",
  "meimao",
  "mouth_open",
  "glass",
  "hair_front_black",
  "hair_front1",
  "hair_right",
  "hat",
  "arm_down",
  "arm_up",
  "hand",
  "star_left",
  "star_right",
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


container.style.height = 'auto';
container.style.overflow = 'visible';

// 呼吸动画（缩放）
setInterval(() => {
  if (!container) return;

  container.style.transform = "scale(1.02)";
  setTimeout(() => {
    container.style.transform = "scale(1)";
  }, 1000);  // 每次呼吸 1 秒
}, 3000);  // 每 3 秒呼吸一次

// 张嘴动画
setInterval(() => {
  const mouth = document.getElementById("mouth_open");
  if (!mouth) return;

  mouth.style.display = "block";  // 张嘴
  setTimeout(() => {
    mouth.style.display = "none"; // 合上嘴
  }, 500); // 张嘴持续时间
}, 4000);  // 每隔 4 秒张嘴一次
