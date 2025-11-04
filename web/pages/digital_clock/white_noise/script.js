const canvas = document.getElementById("noiseCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function generateWhiteNoise() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const buffer = new Uint32Array(imageData.data.buffer);

  for (let i = 0; i < buffer.length; i++) {
    const gray = Math.random() * 255;
    buffer[i] =
      (255 << 24) | // alpha
      (gray << 16) | // red
      (gray << 8) |  // green
      gray;          // blue
  }

  ctx.putImageData(imageData, 0, 0);
}

setInterval(generateWhiteNoise, 50);

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById("clock").textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();
