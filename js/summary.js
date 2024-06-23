let registeredUser;

function init() {
    loadLocalStorage();
    includeHTML();
    showGreeting();
    greetAnimate();
    urgentDate();
}

function showGreeting() {
    checkTrueRegistered();
    let hours = new Date().getHours();
    let greeting = document.getElementById('greeting');
    let topGreeting = document.getElementById('top-greeting');
    let greetingName = document.getElementById('greeting-name');
    let greetingNameTop = document.getElementById('greeting-name-top');
    
    greetingName.innerHTML = greetingNameTop.innerHTML = registeredUser;

    if (hours >= 6 && hours < 12) {
        greeting.innerHTML = topGreeting.innerHTML  = 'Good Morning';

    } else if (hours >= 12 && hours < 18) {
        greeting.innerHTML = topGreeting.innerHTML= 'Good Afternoon';
    } else {
        greeting.innerHTML = topGreeting.innerHTML = 'Good Evening';
    }
}

function checkTrueRegistered(){
    for (let index = 0; index < allUsers.length; index++) {
        let user = allUsers[index];
        if(user['registered'] == true){
            registeredUser = user['name'];
            user['registered'] = false;
            saveLocalStorage;
            break;
        }
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

function changeSvgColor(path) {
    document.getElementById(path).classList.add('cls-4');
}

function resetSvgColor(path) {
        document.getElementById(path).classList.remove('cls-4');
}

function urgentDate() {
    let months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    let urgentDate = new Date();
    urgentDate.setDate(urgentDate.getDate() + 4);

    let year = urgentDate.getFullYear();
    let month = months[urgentDate.getMonth()];
    let day = urgentDate.getDate();
    let upcomingDate = `${month} ${day}, ${year}`;
    document.getElementById('urgent-date').innerHTML = upcomingDate;
}