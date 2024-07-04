let allTasksSummary = [];
let registeredUserName;
let registeredUserInitials;
let upcomingDate;

document.addEventListener('DOMContentLoaded', function () {
    initSummary();
});

async function initSummary() {
    await checkLoadUsers();
    checkRegisteredUser();
    includeHTML();
    checkTrueRegistered();
    getInitialsName();
    showGreeting();
    greetAnimate();
    await getNumOfTasks();
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
    if (window.innerWidth < 1210) {
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
                resolve();
            }, () => {
                reject('hat nicht geklappt!');
            });
        }, 300);
    });
}

async function getNumOfTasks() {
    let prom = await loadTasksSummary();
    document.getElementById('to-do-h2').innerHTML = numOfToDO();
    document.getElementById('done-h2').innerHTML = numOfDone();
    document.getElementById('urgent-h2').innerHTML = numOfUrgent();
    document.getElementById('urgent-date').innerHTML = (upcomingDate) ? upcomingDate : 'no deadline';
    document.getElementById('num-of-board-tasks-h2').innerHTML = allTasksSummary.length;
    document.getElementById('num-of-progress-tasks-h2').innerHTML = numOfInProgress();
    document.getElementById('num-of-awaiting-tasks-h2').innerHTML = numOfAwaiting();
}

function numOfToDO() {
    let numOfToDoTasks = 0;
    for (let index = 0; index < allTasksSummary.length; index++) {
        if (allTasksSummary[index]['taskBoardCategory'] == 'toDo') {
            numOfToDoTasks++;
        }
    }
    return numOfToDoTasks;
}
function numOfDone() {
    let numOfDoneTasks = 0;
    for (let index = 0; index < allTasksSummary.length; index++) {
        if (allTasksSummary[index]['taskBoardCategory'] == 'done') {
            numOfDoneTasks++;
        }
    }
    return numOfDoneTasks;
}

function numOfUrgent() {
    let numOfUrgentTasks = 0;
    let upcomingDateArray = [];
    for (let index = 0; index < allTasksSummary.length; index++) {
        if (allTasksSummary[index]['taskPriorityText'] == 'Urgent') {
            numOfUrgentTasks++;
            upcomingDateArray.push(allTasksSummary[index]['taskDate']);
        }
    }
    for (let i = 0; i < upcomingDateArray.length; i++) {
        for (let j = 0; j < upcomingDateArray.length; j++) {
            if (upcomingDateArray[i] < upcomingDateArray[j]) {
                upcomingDate = upcomingDateArray[i];
            } else {
                upcomingDate = upcomingDateArray[j];
            }
        }
    }
    return numOfUrgentTasks;
}

function numOfInProgress() {
    let numOfProgrssTask = 0;
    for (let index = 0; index < allTasksSummary.length; index++) {
        if (allTasksSummary[index]['taskBoardCategory'] == 'inProgress') {
            numOfProgrssTask++;
        }
    }
    return numOfProgrssTask;
}

function numOfAwaiting() {
    let numOfAwaitingTask = 0;
    for (let index = 0; index < allTasksSummary.length; index++) {
        if (allTasksSummary[index]['taskBoardCategory'] == 'awaitFeedback') {
            numOfAwaitingTask++;
        }
    }
    return numOfAwaitingTask;
}

function getInitialsName() {
    if (registeredUserInitials) {
        document.getElementById('sub-contact-initial-container').innerHTML = registeredUserInitials;
    }
}

function goToBoardSite() {
    window.location.href = 'board.html';
}