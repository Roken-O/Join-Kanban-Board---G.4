let currentDraggedElement;

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
    let categoryColor;
    if (task['taskCategory'] === 'User Story') {
      categoryColor = '#0038ff';
    } else if (task['taskCategory'] === 'Technical Task') {
      categoryColor = '#1fd7c1';
    }
    let subtasksHTML = '';
      if (task['taskSubTask']) {
        subtasksHTML = task['taskSubTask'].map((subtask, index) => {
          return /*html*/ `
            <div class="subtask">
              <input type="checkbox" id="subtask-${task['taskId']}-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtaskDoneInTask('${task['taskId']}', ${index})">
              <label for="subtask-${task['taskId']}-${index}">${subtask.name}</label>
            </div>`;
        }).join('');
      } else {
        subtasksHTML = 'No subtasks';
      }
    taskDetails.innerHTML = /*html*/ `
      <div id="popup-task-container" class="popup-task-container" onclick="doNotClose(event)">
        <h4 style="background: ${categoryColor}">${task['taskCategory']}</h4>
        <h2>${task['taskTitle']}</h2>
        <p>${task['taskDescription']}</p>
        <span class="popup-span">Due date: ${formDate}</span>
        <div class="popup-priority-container">
          <span class="popup-span">Priority:</span>
          <div class="popup-priority-img-container">${task['taskPriorityText']} <img src="${task['taskPriority']}"></div>
        </div>
        <div >
          <span class="popup-span">Assigned To:</span>
          ${assignedContacts}
        </div>
        <div class="popup-subtasks-container">
          <span class="popup-span">Subtasks</span>
          ${subtasksHTML}
        </div>
        <div class="popup-modify-delete-container">
          <div class="popup-del-edit">
            <img src="/assets/img/delete_icon.png">
            <span onclick="deleteTask('${task['taskId']}');  closePopup()"> Delete </span>
          </div>
          <div class="popup-del-edit">
            <img src="/assets/img/pen_DARK.png">
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


function toggleSubtaskDoneInTask(taskId, subtaskIndex) {
  let taskRef = database.ref('tasks/' + taskId + '/taskSubTask/' + subtaskIndex);
  taskRef.once('value', function(snapshot) {
    let subtask = snapshot.val();
    subtask.done = !subtask.done;
    taskRef.set(subtask);
  });
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


window.onload = function() {
    loadTasksBoard();
    includeHTML();
}


function loadTasksBoard() {
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
  const element = document.getElementById(id);
  if (element) {
    element.classList.add('container-rotate');
  } else {
    console.error('Element with id ' + id + ' not found');
  }
}


function generateTaskHTML(task) {
  let contactNames = task['taskAssignment'] ? task['taskAssignment'].map(contact => contact['name']) : [];
  let initials;
  if (contactNames.length > 1) {
      initials = getInitialsList(contactNames);
  } else if (contactNames.length === 1) {
      initials = [getInitials(contactNames[0])];
  }

  let categoryColor = task['taskCategoryColor'];
  if (selectedCategory === 'User Story') {
      categoryColor = '#0038ff';
  } else if (selectedCategory === 'Technical Task') {
      categoryColor = '#1fd7c1';
  }

  let assignedContactsHTML = task['taskAssignment'].map((contact, index) => {
      return `<div class="task-contact-initials" style="background: ${contact['color']};">${initials[index]}</div>`;
  }).join('');
  let completedSubtasks = task['taskSubTask'] ? task['taskSubTask'].filter(subtask => subtask.done).length : 0;
  let totalSubtasks = task['taskSubTask'] ? task['taskSubTask'].length : 0;
  let progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  let taskId = `${task['taskId']}`;

  return /*html*/`<div id="${taskId}" class="task-board-container" onclick="openTaskDetails('${taskId}')" draggable="true" ondragstart="startDragging('${taskId}')">
              <div class="task-item-output" id="task-category-container" style="background-color: ${categoryColor}">${task['taskCategory']}</div>
              <div class="task-item-output" id="task-title-container"><span>${task['taskTitle']}</span></div>
              <div class="task-item-output" id="task-description-container"><span>${task['taskDescription']}</span></div>
              <div class="task-item-output" id="task-progress-container">
                <progress style="max-width: 150px;" value="${progress}" max="100"></progress>
                <span>${completedSubtasks}/${totalSubtasks} Subtasks</span>
              </div>
              <div id="task-bottom-row">
                <div class="task-item-output" id="task-assignment-container">${assignedContactsHTML}</div>
                <div class="task-item-output" id="task-priority-container"><img src="${task['taskPriority']}" id="task-priority-icon-task" alt="Priority Icon"/></div>
              </div>
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


function highlight(category) {
  document.getElementById(category).classList.add('drag-area-highlight');
  setTimeout(() => {
    document.getElementById(category).classList.remove('drag-area-highlight');
  }, 1500);
}


function removeHighlight(category) {
  setTimeout(() => {
  document.getElementById(category).classList.remove('drag-area-highlight');
  }, 1000);
}