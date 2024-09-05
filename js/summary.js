/**
 * @type {Array<Object>}
 * Array to hold the summary of all tasks.
 */
let allTasksSummary = [];

/**
 * @type {string | undefined}
 * Holds the name of the currently registered user.
 */
let registeredUserName;

/**
 * @type {string | undefined}
 * Holds the initials of the currently registered user.
 */
let registeredUserInitials;

/**
 * @type {string | undefined}
 * Holds the upcoming date for urgent tasks.
 */
let upcomingDate;

/**
 * Initializes the summary page by loading user data, checking registration status,
 * and displaying task-related information.
 */
document.addEventListener('DOMContentLoaded', function () {
  initSummary();
});

/**
 * Initializes the summary by performing several asynchronous and synchronous operations.
 * It includes loading user data, checking registration status, retrieving user initials,
 * showing greeting, animating the greeting, and fetching the number of tasks.
 * @returns {Promise<void>} A promise that resolves when initialization is complete.
 */
async function initSummary() {
  await checkLoadUsers();
  checkRegisteredUser();
  checkTrueRegistered();
  getInitialsName();
  showGreeting();
  greetAnimate();
  await getNumOfTasks();
}

/**
 * Displays a greeting based on the current time of day and updates the greeting elements
 * in the DOM with the registered user's name if available.
 */
function showGreeting() {
  /**
   * @type {number}
   * Current hour of the day (0-23).
   */
  let hours = new Date().getHours();
  /**
   * @type {HTMLElement | null}
   * DOM element for greeting message.
   */
  let greeting = document.getElementById('greeting');
  /**
   * @type {HTMLElement | null}
   * DOM element for top greeting message.
   */
  let topGreeting = document.getElementById('top-greeting');
  /**
   * @type {HTMLElement | null}
   * DOM element for greeting name.
   */
  let greetingName = document.getElementById('greeting-name');
  /**
   * @type {HTMLElement | null}
   * DOM element for top greeting name.
   */
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

/**
 * Checks and sets the details of the currently registered user.
 */
function checkTrueRegistered() {
  for (let index = 0; index < allUsers.length; index++) {
    /**
     * @type {Object}
     * Represents a user object with properties for registration status and user details.
     */
    let user = allUsers[index];
    if (user['registered'] == true) {
      registeredUserName = user['name'];
      registeredID = user['id'];
      registeredUserInitials = user['initial'];
      break;
    }
  }
}

/**
 * Animates the greeting based on screen width by fading in and out the greeting elements.
 */
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

/**
 * Loads and processes the summary of tasks from the database.
 * @returns {Promise<void>} A promise that resolves when the tasks are loaded and processed.
 */
function loadTasksSummary() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let tasks = database.ref('tasks');
      tasks.on(
        'value',
        function (snapshot) {
          allTasksSummary = [];
          snapshot.forEach(function (childSnapshot) {
            let task = childSnapshot.val();
            task.taskId = childSnapshot.key;
            allTasksSummary.push(task);
          });
          resolve();
        },
        () => {
          reject('hat nicht geklappt!');
        }
      );
    }, 300);
  });
}

/**
 * Retrieves the number of tasks for various categories and updates the DOM elements with the values.
 * @returns {Promise<void>} A promise that resolves when the number of tasks is retrieved and displayed.
 */
async function getNumOfTasks() {
  let prom = await loadTasksSummary();
  document.getElementById('to-do-h2').innerHTML = numOfToDO();
  document.getElementById('done-h2').innerHTML = numOfDone();
  document.getElementById('urgent-h2').innerHTML = numOfUrgent();
  document.getElementById('urgent-date').innerHTML = upcomingDate ? upcomingDate : 'no deadline';
  document.getElementById('num-of-board-tasks-h2').innerHTML = allTasksSummary.length;
  document.getElementById('num-of-progress-tasks-h2').innerHTML = numOfInProgress();
  document.getElementById('num-of-awaiting-tasks-h2').innerHTML = numOfAwaiting();
}

/**
 * Calculates the number of tasks in the 'toDo' category.
 * @returns {number} The number of 'toDo' tasks.
 */
function numOfToDO() {
  /**
   * @type {number}
   * The count of 'toDo' tasks.
   */
  let numOfToDoTasks = 0;
  for (let index = 0; index < allTasksSummary.length; index++) {
    if (allTasksSummary[index]['taskBoardCategory'] == 'toDo') {
      numOfToDoTasks++;
    }
  }
  return numOfToDoTasks;
}

/**
 * Calculates the number of tasks in the 'done' category.
 * @returns {number} The number of 'done' tasks.
 */
function numOfDone() {
  /**
   * @type {number}
   * The count of 'done' tasks.
   */
  let numOfDoneTasks = 0;
  for (let index = 0; index < allTasksSummary.length; index++) {
    if (allTasksSummary[index]['taskBoardCategory'] == 'done') {
      numOfDoneTasks++;
    }
  }
  return numOfDoneTasks;
}

/**
 * Calculates the number of tasks marked as 'Urgent' and finds the earliest upcoming date.
 * @returns {number} The number of 'Urgent' tasks.
 */
function numOfUrgent() {
  /**
   * @type {number}
   * The count of 'Urgent' tasks.
   */
  let numOfUrgentTasks = 0;
  /**
   * @type {Array<string>}
   * Array of dates for 'Urgent' tasks.
   */
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

/**
 * Calculates the number of tasks in the 'inProgress' category.
 * @returns {number} The number of 'inProgress' tasks.
 */
function numOfInProgress() {
  let numOfProgrssTask = 0;
  for (let index = 0; index < allTasksSummary.length; index++) {
    if (allTasksSummary[index]['taskBoardCategory'] == 'inProgress') {
      numOfProgrssTask++;
    }
  }
  return numOfProgrssTask;
}

/**
 * Calculates the number of tasks in the 'awaitFeedback' category.
 * @returns {number} The number of 'awaitFeedback' tasks.
 */
function numOfAwaiting() {
  /**
   * @type {number}
   * The count of 'awaitFeedback' tasks.
   */
  let numOfAwaitingTask = 0;
  for (let index = 0; index < allTasksSummary.length; index++) {
    if (allTasksSummary[index]['taskBoardCategory'] == 'awaitFeedback') {
      numOfAwaitingTask++;
    }
  }
  return numOfAwaitingTask;
}

/**
 * Displays the registered user's initials in the specified DOM container.
 */
function getInitialsName() {
  if (registeredUserInitials) {
    /**
     * @type {HTMLElement | null}
     * DOM element for displaying user's initials.
     */
    document.getElementById('sub-contact-initial-container').innerHTML = registeredUserInitials;
  }
}

/**
 * Navigates the user to the board page.
 */
function goToBoardSite() {
  window.location.href = 'board.html';
}
