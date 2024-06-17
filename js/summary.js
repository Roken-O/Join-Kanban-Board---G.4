function init() {
    includeHTML();
    showGreeting();
    greetAnimate();
}

function showGreeting(){
    let hours = new Date().getHours();
    let greeting = document.getElementById('greeting');
    let topGreeting = document.getElementById('top-greeting');

    if (hours >= 6 && hours < 12) {
        greeting.innerHTML = 'Good Morning';
        topGreeting.innerHTML = 'Good Morning';
    } else if (hours >= 12 && hours < 18) {
        greeting.innerHTML = 'Good Afternoon';
        topGreeting.innerHTML = 'Good Afternoon';
    } else {
        greeting.innerHTML = 'Good Evening';
        topGreeting.innerHTML = 'Good Evening';
    }
}

function greetAnimate() {
    if (window.innerWidth < 1100) {
        setTimeout(() => {
            let leftMainContainer = document.getElementById('left-main-container');
            let greet = document.getElementById('greet');

            leftMainContainer.style.opacity = '0';
            greet.style.opacity = '1';
            greet.style.display = 'flex';
            setTimeout(() => {
                leftMainContainer.style.opacity = '1';
                greet.style.display = 'none';
                greet.style.opacity = '0';
            }, 1500);
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