// function initBoard(){
//   includeHTML();
//   setTimeout(() => {
//   loadLocalStorage();
//   checkTrueRegistered();
//   getInitialsName();
// }, 10);
// }




function openTaskDetails(taskId) {
  let taskDetails = document.getElementById('task');
  taskDetails.style.display = 'flex';

  let task = allTasks.find(t => t.taskId === taskId);

  if (task) {
    let assignedContacts = task['taskAssignment'] ? task['taskAssignment'].map(contact => contact['name']).join(', ') : 'No contacts assigned';
    let dateParts = task['taskDate'].split('-');
    let formDate = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0];
    let subtasks = task['taskSubTask'] ? task['taskSubTask'].join(', ') : 'No subtasks';

    taskDetails.innerHTML = /*html*/ `
      <div id="popup-task-container" class="popup-task-container" onclick="doNotClose(event)">
        <h4>${task['taskCategory']}</h4>
        <h2>${task['taskTitle']}</h2>
        <p>${task['taskDescription']}</p>
        <span class="popup-span">Due date: ${formDate}</span>
        <div class="popup-priority-container">
          <span class="popup-span">Priority:</span>
          <div class="popup-priority-img-container">${task['taskPriority']} <img src="${task['taskPriorityIcon']}"></div>
        </div>
        <div >
          <span class="popup-span">Assigned To:</span>
          ${assignedContacts}
        </div>
        <div class="popup-subtasks-container">
          <span class="popup-span">Subtasks</span>
          ${subtasks}
        </div>
        <div class="popup-modify-delete-container">
          <div class="popup-del-edit">
            <img src="./assets/img/delete_icon.png">
            <span onclick="deleteTask('${task['taskId']}')"> Delete </span>
          </div>
          <div class="popup-del-edit">
            <img src="./assets/img/pen_DARK.png">
            <span onclick="editTask('${task['taskId']}')"> Edit </span>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      document.getElementById('popup-task-container').classList.add('animate-popup-task-container');
    }, 200);
  }
}

function closePopup() {
  let taskDetails = document.getElementById('task');
  taskDetails.style.display = 'none';
}

function doNotClose(event) {
  event.stopPropagation();
}

function filterTask() {
  let search = document.getElementById("search").value;
  search = search.toLowerCase();
  if (search.length > 2) {
    let content = document.getElementById("content");
    content.innerHTML = "";
    // for (let i = 0; i < data.length; i++) {
    //   const pokemonName = data[i]["name"];
    //   if (pokemonName.toLowerCase().includes(search)) {
    //     let pokemonData = data[i];
    //     content.innerHTML += renderCards(i, pokemonData);
    //     rendertypes(i, pokemonData);
    //   }
    // } 
  }
}

let currentDraggedElement;

window.onload = function() {
    loadTasks();
}

function loadTasks() {
    let tasks = database.ref('tasks');

    tasks.on('value', function(snapshot) {
        allTasks = [];

        snapshot.forEach(function(childSnapshot) {
            let task = childSnapshot.val();
            task.taskId = childSnapshot.key;
            allTasks.push(task);
        });

        updateTaskBoard();
    });
}

function updateTaskBoard() {
    boardCategory.forEach(category => {
        let tasks = allTasks.filter(task => task['taskBoardCategory'] === category);
        document.getElementById(category).innerHTML = '';

        tasks.forEach(task => {
            document.getElementById(category).innerHTML += generateTaskHTML(task);
        });
    });
}


function startDragging(id) {
  currentDraggedElement = id;
}


function generateTaskHTML(task) {
    let assignedContacts = task['taskAssignment'] ? task['taskAssignment'].map(contact => contact['name']).join(', ') : 'No contacts assigned';
    let dateParts = task['taskDate'].split('-');
    let formDate = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0];
    let subtasks = task['taskSubTask'] ? task['taskSubTask'].join(', ') : 'No subtasks';

    return /*html*/`<div id="task-trial-board-container" draggable="true" ondragstart="startDragging('${task['taskId']}')">
                <div class="task-item-output" id="task-trial-category-container">${task['taskCategory']}</div>
                <div class="task-item-output" id="task-trial-title-container">${task['taskTitle']}</div>
                <div class="task-item-output" id="task-trial-description-container">${task['taskDescription']}</div>
                <div class="task-item-output" id="formatted-date-display">Due date: ${formDate}</div>
                <div class="task-item-output" id="task-trial-priority-container"><img src="${task['taskPriority']}" id="task-trial-priority-icon-task" alt="Priority Icon"/></div>
                <div class="task-item-output" id="task-trial-assignment-container">Assigned to: ${assignedContacts}</div>
                <div class="task-item-output" id="task-trial-subtask-container">Subtasks: ${subtasks}</div>
                <div id="task-trial-button-container">
                    <div style="display: flex; align-items: center; cursor: pointer;" id="task-trial-delete-button">
                        <img style="height: 12px; width: 12px; cursor: pointer;" src="/assets/img/delete_icon.svg" alt="" />
                        <button style="background: transparent; border: none; cursor: pointer;" onclick="deleteTask('${task['taskId']}')">Delete</button>
                    </div>
                    <div style="display: flex; align-items: center; cursor: pointer;" id="task-trial-edit-button">
                        <img style="height: 12px; width: 12px; cursor: pointer;" src="/assets/img/pen_DARK.svg" alt="" />
                        <button style="background: transparent; border: none; cursor: pointer;" onclick="editTask('${task['taskId']}')">Edit</button>
                    </div>
                </div>
                <div id="task-edit-container"></div>
            </div>`;
}


function allowDrop(ev) {
    ev.preventDefault();
}


function moveTo(category) {
    let task = allTasks.find(t => t['taskId'] === currentDraggedElement);

    task['taskBoardCategory'] = category;
    database.ref('tasks/' + task['taskId']).update(task).then(() => {
        updateTaskBoard();
    });
}