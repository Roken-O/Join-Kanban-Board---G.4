function changeSvgColor(svgId, path) {
    let svgElement = document.getElementById(svgId);
    if (svgElement) {
        document.getElementById(path).classList.add('cls-4');
    }
}

function resetSvgColor(svgId, path) {
    let svgElement = document.getElementById(svgId);
    if (svgElement) {
        document.getElementById(path).classList.remove('cls-4');
    }
}