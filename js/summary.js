function init() {
    includeHTML();
    greetAnimate();
}

// function greetAnimate() {
//     if (window.innerWidth < 1100) {
//         setTimeout(() => {
//             document.getElementById('left-main-container').style.display = 'none';
//             document.getElementById('greet').style.display = 'block';

//             // document.getElementById('greet').classList.add('greet-animate');

//             setTimeout(() => {
//                 document.getElementById('left-main-container').style.display = 'flex';
//                 document.getElementById('greet').style.display = 'none';
//             }, 2000);
//         }, 10);
//     }
// }

function greetAnimate() {
    if (window.innerWidth < 1100) {
        setTimeout(() => {
            let leftMainContainer = document.getElementById('left-main-container');
            let greet = document.getElementById('greet');

            if (leftMainContainer && greet) {
                leftMainContainer.style.opacity = '0';
                greet.style.opacity = '1';
                greet.style.display = 'flex';
                setTimeout(() => {
                    leftMainContainer.style.opacity = '1';
                    greet.style.display = 'none';
                    greet.style.opacity = '0';
                }, 1500);
            }
        }, 10);
    }
}




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