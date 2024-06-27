let allTasksSummary = [];
let registeredUserName;
let registeredUserInitials;
let registeredID;
let upcomingDate;

document.addEventListener('DOMContentLoaded', function () {
    initSummary();
});

async function initSummary() {
    await checkLoadUsers();
    // loadLocalStorage();
    checkRegisteredUser();
    includeHTML();
    checkTrueRegistered();
    getInitialsName();
    showGreeting();
    greetAnimate();
    await getNumOfTasks();
}

//checkRegisteredUser() muss auf jeder Seite eingebunden werden, um zu verhindern, dass der Nutzer auf andere Seiten zugreift, ohne eingeloggt zu sein oder als Gast eingeloggt ist.
function checkRegisteredUser() {
    let loged = false;
    for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i]['registered'] == true) {
            loged = true;
            break;
        }
    }
    if (loged == false) {
        window.location.href = 'index.html';
    }
}

function showGreeting() {
    let hours = new Date().getHours();
    let greeting = document.getElementById('greeting');
    let topGreeting = document.getElementById('top-greeting');
    let greetingName = document.getElementById('greeting-name');
    let greetingNameTop = document.getElementById('greeting-name-top');
    if (registeredUserName) {
        greetingName.innerHTML = greetingNameTop.innerHTML = registeredUserName;
    } else {
        greetingName.innerHTML = greetingNameTop.innerHTML = '';
    }
    if (hours >= 6 && hours < 12) {
        greeting.innerHTML = topGreeting.innerHTML = 'Good Morning';
    } else if (hours >= 12 && hours < 18) {
        greeting.innerHTML = topGreeting.innerHTML = 'Good Afternoon';
    } else {
        greeting.innerHTML = topGreeting.innerHTML = 'Good Evening';
    }
}

function checkTrueRegistered() {
    for (let index = 0; index < allUsers.length; index++) {
        let user = allUsers[index];
        if (user['registered'] == true) {
            registeredUserName = user['name'];
            registeredID = user['id'];
            registeredUserInitials = user['initial'];
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

function loadTasksSummary() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let tasks = database.ref('tasks');
            tasks.on('value', function (snapshot) {
                allTasksSummary = [];
                snapshot.forEach(function (childSnapshot) {
                    let task = childSnapshot.val();
                    task.taskId = childSnapshot.key;
                    allTasksSummary.push(task);
                });
                resolve('hat geklappt!');
            }, () => {
                reject('hat nicht geklappt!');
            });
        }, 300);
    });
}

async function getNumOfTasks() {
    let prom = await loadTasksSummary();
    console.log(prom);
    document.getElementById('to-do-h2').innerHTML = numOfToDO();
    document.getElementById('done-h2').innerHTML = numOfDone();
    document.getElementById('urgent-h2').innerHTML = numOfUrgent();
    document.getElementById('urgent-date').innerHTML = (upcomingDate) ? upcomingDate : 'no deadline';
    document.getElementById('num-of-board-tasks-h2').innerHTML = allTasksSummary.length;
    document.getElementById('num-of-progress-tasks-h2').innerHTML = numOfInProgress();
    document.getElementById('num-of-awaiting-tasks-h2').innerHTML = numOfAwaiting();
}

function numOfToDO(){
    let numOfToDoTasks = 0;
    for (let index = 0; index < allTasksSummary.length; index++) {
        if(allTasksSummary[index]['taskBoardCategory'] == 'toDo'){
            numOfToDoTasks++;
        } 
    }
    return numOfToDoTasks;
}
function numOfDone(){
    let numOfDoneTasks = 0;
    for (let index = 0; index < allTasksSummary.length; index++) {
        if(allTasksSummary[index]['taskBoardCategory'] == 'done'){
            numOfDoneTasks++;
        } 
    }
    return numOfDoneTasks;
}
function numOfUrgent(){
    let numOfUrgentTasks = 0;
    for (let index = 0; index < allTasksSummary.length; index++) {
        if(allTasksSummary[index]['taskPriority'] == '/assets/img/urgent_icon.svg'){
            numOfUrgentTasks++;
            upcomingDate = allTasksSummary[index]['taskDate'];
        } 
    }
    return numOfUrgentTasks;
}


function numOfInProgress(){
    let numOfProgrssTask = 0;
    for (let index = 0; index < allTasksSummary.length; index++) {
        if(allTasksSummary[index]['taskBoardCategory'] == 'inProgress'){
        numOfProgrssTask++;
        } 
    }
    return numOfProgrssTask;
}

function numOfAwaiting(){
    let numOfAwaitingTask = 0;
    for (let index = 0; index < allTasksSummary.length; index++) {
        if(allTasksSummary[index]['taskBoardCategory'] == 'awaitFeedback'){
            numOfAwaitingTask++;
        } 
    }
    return numOfAwaitingTask ;
}

function toggleShowLogout() {
    let logoutContainer = document.getElementById('showLogout');
    logoutContainer.innerHTML = `
     <div class="popout-showlogout">
        <a href="privacy.html">Legal Notice</a>
        <a href="privacy.html">Privacy Policy</a>
        <a onclick="logout('${registeredID}')" href="#">Log Out</a>
      </div>`;
    if (logoutContainer.style.display == 'flex') {
        logoutContainer.style.display = 'none';
    } else {
        logoutContainer.style.display = 'flex';
    }
}

function getInitialsName() {
    if (registeredUserInitials) {
        document.getElementById('sub-contact-initial-container').innerHTML = registeredUserInitials;
    }
}

function logout(registeredID) {
    let database = firebase.database();
    if (registeredID) {
        let userEntry = database.ref("users/" + registeredID + "/registered/");
        userEntry.set(false);
    }
    window.location.href = 'index.html';
}

function goToBoardSite() {
    window.location.href = 'board.html';
}


