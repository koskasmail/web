function updateDimensions() {
    const widthPx = window.innerWidth;
    const heightPx = window.innerHeight;

    const pxToCm = 0.026458333;
    const pxToInch = 0.010416667;

    const widthCm = (widthPx * pxToCm).toFixed(2);
    const heightCm = (heightPx * pxToCm).toFixed(2);

    const widthInch = (widthPx * pxToInch).toFixed(2);
    const heightInch = (heightPx * pxToInch).toFixed(2);

    document.getElementById('widthPx').textContent = widthPx;
    document.getElementById('widthCm').textContent = widthCm;
    document.getElementById('widthInch').textContent = widthInch;
    document.getElementById('heightPx').textContent = heightPx;
    document.getElementById('heightCm').textContent = heightCm;
    document.getElementById('heightInch').textContent = heightInch;
}

window.addEventListener('resize', updateDimensions);
updateDimensions();
