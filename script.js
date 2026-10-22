const imageInput = document.getElementById('imageInput');
const latentRange = document.getElementById('latentRange');
const latentValue = document.getElementById('latentValue');
const originalImage = document.getElementById('originalImage');
const originalPlaceholder = document.getElementById('originalPlaceholder');
const reconPlaceholder = document.getElementById('reconPlaceholder');
const canvas = document.getElementById('reconstructedCanvas');
const ctx = canvas.getContext('2d');
const compareBtn = document.getElementById('compareBtn');
let imageReady = false;
let currentUrl = null;

function updateLabels() {
  const n = Number(latentRange.value);
  latentValue.value = n;
  document.getElementById('metricLatent').textContent = n;
  const compression = n <= 12 ? 'Very high' : n <= 32 ? 'High' : n <= 64 ? 'Moderate' : 'Lower';
  const detail = n <= 12 ? 'Low' : n <= 32 ? 'Balanced' : n <= 64 ? 'Good' : 'High';
  document.getElementById('metricCompression').textContent = compression;
  document.getElementById('metricDetail').textContent = detail;
  if (imageReady) renderReconstruction();
}
function renderReconstruction() {
  if (!imageReady) return;
  const maxSide = Math.max(8, Math.round(Number(latentRange.value) * 2));
  const scale = Math.min(1, maxSide / Math.max(originalImage.naturalWidth, originalImage.naturalHeight));
  const smallW = Math.max(1, Math.round(originalImage.naturalWidth * scale));
  const smallH = Math.max(1, Math.round(originalImage.naturalHeight * scale));
  const small = document.createElement('canvas');
  small.width = smallW; small.height = smallH;
  const smallCtx = small.getContext('2d');
  smallCtx.imageSmoothingEnabled = true;
  smallCtx.drawImage(originalImage, 0, 0, smallW, smallH);
  canvas.width = originalImage.naturalWidth;
  canvas.height = originalImage.naturalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
  canvas.style.display = 'block';
  reconPlaceholder.style.display = 'none';
}
imageInput.addEventListener('change', () => {
  const file = imageInput.files && imageInput.files[0];
  if (!file) return;
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  currentUrl = URL.createObjectURL(file);
  originalImage.onload = () => {
    imageReady = true;
    originalImage.style.display = 'block';
    originalPlaceholder.style.display = 'none';
    renderReconstruction();
  };
  originalImage.src = currentUrl;
});
latentRange.addEventListener('input', updateLabels);
compareBtn.addEventListener('click', () => {
  updateLabels();
  if (!imageReady) {
    alert('Please choose an image first.');
    return;
  }
  renderReconstruction();
});
updateLabels();
