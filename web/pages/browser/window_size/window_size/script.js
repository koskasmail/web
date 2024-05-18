function updateDimensions() {
    const currentWindowSize = document.getElementById('currentWindowSize');
    const deviceName = document.getElementById('deviceName');

    const widthPx = window.innerWidth;
    const heightPx = window.innerHeight;

    const pxToCm = 0.026458333;
    const pxToInch = 0.010416667;

    const widthCm = (widthPx * pxToCm).toFixed(2);
    const heightCm = (heightPx * pxToCm).toFixed(2);

    const widthInch = (widthPx * pxToInch).toFixed(2);
    const heightInch = (heightPx * pxToInch).toFixed(2);
 
    let widthResult = "";
    if (widthPx < 767) {
        widthResult = "mobile";
    } else if (widthPx >= 768 && widthPx <= 991) {
        widthResult = "tablet";
    } else if (widthPx >= 992 && widthPx <= 1199) {
        widthResult = "laptop";
    } else if (widthPx > 1200) {
        widthResult = "desktop";
    } else {
        widthResult = "???";
    }
    deviceName.innerHTML = "---[" + widthResult + "]---";

    currentWindowSize.innerHTML = `
        <p>Width: ${widthPx}px (${widthCm} cm, ${widthInch} inch)</p>
        <p>Height: ${heightPx}px (${heightCm} cm, ${heightInch} inch)</p>
    `;
}

window.addEventListener('resize', updateDimensions);
updateDimensions();


