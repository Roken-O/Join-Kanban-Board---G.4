let currentDraggedElement;

window.onload = function() {
  loadContactListPopup();
  loadContactList();
  loadTasksBoard();
  includeHTML();
  changeColor();
  resetButtons();
  loadLocalStorage();
  checkRegisteredUser();
  loadUsers();
  checkLoadUsers();
}

function loadUsers() {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          let database = firebase.database();
          let usersEntries = database.ref("users");
          usersEntries.on("value", function (snapshot) {
              allUsers = [];
              snapshot.forEach(function (childSnapshot) {
                  let user = childSnapshot.val();
                  user.id = childSnapshot.key;
                  allUsers.push(user);
              });
              resolve('hat geklappt!');
          }, () => {
              reject('hat nicht geklappt!');
          });
      }, 10);
  });
}

async function checkLoadUsers() {
  let prom = await loadUsers();
  saveLocalStorage();
  console.log(prom);
}

function checkInputs() {
  document.getElementById("email").value = '';
  document.getElementById("password").value = '';

  let rememberedEmail = localStorage.getItem('rememberedEmail');
  let rememberedPassword = localStorage.getItem('rememberedPassword');
  if (rememberedEmail) {
      document.getElementById("email").value = rememberedEmail;
      document.getElementById("password").value = rememberedPassword;
      document.getElementById("rememberMe").checked = true;
  }
}

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
        <div id="contacts-list-popup">
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
            <span onclick="deleteTask('${task['taskId']}'); closePopup()"> Delete </span>
          </div>
          <div class="popup-del-edit">
            <img src="/assets/img/pen_DARK.png">
            <span onclick="editPopupTask('${task['taskId']}'); showPopupEditContainer(); closePopup();"> Edit </span>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      document.getElementById('popup-task-container').classList.add('animate-popup-task-container');
    }, 200);
  }
  
}


function loadContactListPopup() {
  let database = firebase.database();
  let contactEntries = database.ref('contacts');

  contactEntries.on('value', function(snapshot) {
      allContacts = [];
      snapshot.forEach(function(childSnapshot) {
          let contact = childSnapshot.val();
          allContacts.push(contact);
      });
  });
}


function editPopupTask(taskId) {
  let task = allTasks.find(t => t.taskId === taskId);
  if (task) {
    
    let editTask = document.getElementById('task-popup-edit-container');
    let currentTitle, currentDescription, currentDate, currentSubTask, currentCategory, currentPriority, currentPriorityText, currentSelection, currentCategoryColor;

    for (let i = 0; i < allTasks.length; i++) {
      if (taskId === allTasks[i]['taskId']) {
        currentTitle = allTasks[i]['taskTitle'];
        currentDescription = allTasks[i]['taskDescription'];
        currentDate = allTasks[i]['taskDate'];
        currentSubTask = allTasks[i]['taskSubTask'] || [];
        currentCategory = allTasks[i]['taskCategory'] || '';
        currentCategoryColor = allTasks[i]['taskCategoryColor'];
        currentPriority = allTasks[i]['taskPriority'] || '';
        currentPriorityText = allTasks[i]['taskPriorityText'] || '';
        currentSelection = allTasks[i]['taskAssignment'] || [];
        break;
      }
    }

    let contactsList = '';
    allContacts.forEach(contact => {
      let isChecked = currentSelection.some(selectedContact => selectedContact.email === contact.email);
      contactsList += /*html*/ `
        <div class="dropdown-item">
          <div style="display: flex; align-items:center; justify-content: center; background: ${contact['color']}; color: white; height: 32px; width: 32px; border: 1px solid white; border-radius: 40px; cursor: pointer;" id="contact-badge-list">${getInitials(contact['name'])}</div>
          <label for="${contact['email']}">${contact['name']}</label>
          <input type="checkbox" id="${contact['email']}" value="${contact['email']}" onclick="toggleContactEditPopup(this)" ${isChecked ? 'checked' : ''}>
        </div>
      `;
    });
  
    editTask.innerHTML = /*html*/ `
      <input type="text" id="edit-task-title-container-popup" value="${currentTitle}">
      <input type="text" id="edit-task-description-container-popup" value="${currentDescription}">
      <input type="date" id="edit-task-date-container-popup" value="${currentDate}">
      <input type="text" id="edit-task-subtask-input-popup" placeholder="Subtask">
      <button id="add-subtask-popup-button" type="button" onclick="addSubTaskEditPopup()">Add Subtask</button>
      <ul id="subtask-list-edit-popup"></ul>
      <section id="edit-task-category-container-popup">
      <div id="edit-category-dropdown-container-popup" onclick="toggleCategoryDropdownPopup()">  
        <div class="dropdown-popup" id="category-dropdown-popup" style="background: ${currentCategoryColor}; color: white;">${currentCategory}</div>
        <div>
          <img id="icon-category-dropdown-arrow-image-popup" src="/assets/img/dropdown_down.svg" alt="Dropdown Arrow Icon"/>
        </div>
      </div>
        <div id="category-dropdown-popup-container" class="category-dropdown-popup-container d-none">
          <div class="dropdown-item-category" style="cursor: pointer;" onclick="selectCategoryEditPopup('Technical Task')">Technical Task</div>
          <div class="dropdown-item-category" style="cursor: pointer;" onclick="selectCategoryEditPopup('User Story')">User Story</div>
        </div>
      </section>
      <section id="edit-task-priority-container-popup">
      <div id="edit-priority-container-popup" onclick="togglePriorityDropdownPopup()">        
        <div class="dropdown-popup">${currentPriorityText} <img src="${currentPriority}" alt="Priority Icon"/></div>
        <div>
          <img id="icon-priority-dropdown-arrow-image-popup" src="/assets/img/dropdown_down.svg" alt="Dropdown Arrow Icon"/>
        </div>
      </div>
        <div id="priority-dropdown-popup" class="priority-dropdown-popup d-none">
          <div class="dropdown-item-priority" style="cursor: pointer;" onclick="selectPriorityEditPopup('/assets/img/urgent_icon.svg', 'Urgent')">Urgent</div>
          <div class="dropdown-item-priority" style="cursor: pointer;" onclick="selectPriorityEditPopup('/assets/img/medium_icon.svg', 'Medium')">Medium</div>
          <div class="dropdown-item-priority" style="cursor: pointer;" onclick="selectPriorityEditPopup('/assets/img/low_icon.svg', 'Low')">Low</div>
        </div>
      </section>
      <section id="edit-task-assignment-container-popup">
          <div id="contact-list-selection-popup" onclick="toggleContactDropdownPopup()">
            <span>Assign Contacts</span>
            <div class="icon-dropdown-arrow">
                <img id="icon-contacts-dropdown-arrow-image-popup" src="/assets/img/dropdown_down.svg" alt="Dropdown Arrow Icon"/>
            </div>
          </div>  
          <div id="contacts-list-popup-detail" class="dropdown-list d-none">
            ${contactsList}
          </div>
        
      </section>
      <button id="save-popup-button" onclick="saveEditedPopupTask('${taskId}'); openTaskDetails('${taskId}'); hidePopupEditContainer()">Save</button>
      <button id="cancel-save-popup-button" onclick="openTaskDetails('${taskId}'); hidePopupEditContainer()">Cancel</button>
    `;
  
    selectedContactsEdit = currentSelection.slice();
    subtasksEdit = currentSubTask.slice();
    displaySubTasksEditPopup();
    loadContactListPopup();
  }
}


function toggleContactsDropdown() {
  const dropdown = document.getElementById('contactsDropdown');
  dropdown.classList.toggle('show');
}


function showPopupEditContainer() {
  document.getElementById('task-popup-edit-container').style.display = 'flex';
}


function hidePopupEditContainer() {
  document.getElementById('task-popup-edit-container').style.display = 'none';
}


function toggleContactEditPopup(checkbox) {
  let contactEmail = checkbox.value;
  if (checkbox.checked) {
    let contact = allContacts.find(contact => contact.email === contactEmail);
    selectedContactsEdit.push(contact);
  } else {
    selectedContactsEdit = selectedContactsEdit.filter(contact => contact.email !== contactEmail);
  }
}


function toggleContactAssignmentPopup(checkbox) {
  let contactEmail = checkbox.value;
  if (checkbox.checked) {
    let contact = allContacts.find(contact => contact['email'] === contactEmail);
    selectedContacts.push(contact);
  } else {
    selectedContacts = selectedContacts.filter(contact => contact['email'] !== contactEmail);
  }
}


function toggleContactDropdownPopup() {
  let contactsDropdown = document.getElementById('contacts-list-popup-detail');
  let dropdownArrow = document.getElementById('icon-contacts-dropdown-arrow-image-popup');

  if (contactsDropdown.classList.contains('d-none')) {
      contactsDropdown.classList.remove('d-none');
      dropdownArrow.src = "/assets/img/dropdown_up.svg";
  } else {
      contactsDropdown.classList.add('d-none');
      dropdownArrow.src = "/assets/img/dropdown_down.svg";
  }
}


function toggleCategoryDropdownPopup() {
  let categoryDropdownEdit = document.getElementById('category-dropdown-popup-container');
  let dropdownArrow = document.getElementById('icon-category-dropdown-arrow-image-popup');

  if (categoryDropdownEdit.classList.contains('d-none')) {
      categoryDropdownEdit.classList.remove('d-none');
      dropdownArrow.src = "/assets/img/dropdown_up.svg";
  } else {
      categoryDropdownEdit.classList.add('d-none');
      dropdownArrow.src = "/assets/img/dropdown_down.svg";
  }
}


function togglePriorityDropdownPopup() {
  let categoryDropdownEdit = document.getElementById('priority-dropdown-popup');
  let dropdownArrow = document.getElementById('icon-priority-dropdown-arrow-image-popup');

  if (categoryDropdownEdit.classList.contains('d-none')) {
      categoryDropdownEdit.classList.remove('d-none');
      dropdownArrow.src = "/assets/img/dropdown_up.svg";
  } else {
      categoryDropdownEdit.classList.add('d-none');
      dropdownArrow.src = "/assets/img/dropdown_down.svg";
  }
}


function addSubTaskEditPopup() {
  let subTaskInputEdit = document.getElementById('edit-task-subtask-input-popup');
  let subTaskValueEdit = subTaskInputEdit.value.trim();

  if (subTaskValueEdit !== "") {
    let subTask = {
      name: subTaskValueEdit,
      done: false
    };
    subtasksEdit.push(subTask);
    subTaskInputEdit.value = "";
    displaySubTasksEditPopup();
  }
}


function displaySubTasksEditPopup() {
  let subtaskListEdit = document.getElementById('subtask-list-edit-popup');
  subtaskListEdit.innerHTML = "";

  subtasksEdit.forEach((subtask, index) => {
    let subtaskItemEdit = document.createElement('li');
    subtaskItemEdit.innerHTML = /*html*/`
      <input type="checkbox" id="subtask-edit-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtaskDoneEdit(${index})">
      <div style="display: flex; justify-content: space-between; width: 80%;">
        <label for="subtask-edit-${index}">${subtask.name}</label>
        <button style="background: transparent; border: none; cursor: pointer;" type="button" onclick="removeSubTaskEditPopup(${index})"><img style="height: 12px; width: 12px;" src="assets/img/delete_icon.svg" alt=""></button>
      </div>
    `;
    subtaskListEdit.appendChild(subtaskItemEdit);
  });
}


function removeSubTaskEditPopup(index) {
  subtasksEdit.splice(index, 1);
  displaySubTasksEditPopup();
}


function selectCategoryPopup(event, category) {
  selectedCategory = category;
  document.getElementById('task-category-selection').innerText = selectedCategory;
  document.getElementById('task-category-dropdown').classList.add('d-none');
  document.getElementById('icon-dropdown-arrow-image').src = "/assets/img/dropdown_down.svg";
}


// function createCategoryIconUrgent(event, buttonId) {
//   event.preventDefault();
//   priority = '/assets/img/urgent_icon.svg';
//   changeColor(buttonId);

// }


// function createCategoryIconMedium(event, buttonId) {
//   event.preventDefault();
//   priority = '/assets/img/medium_icon.svg';
//   changeColor(buttonId);
// }


// function createCategoryIconLow(event, buttonId) {
//   event.preventDefault();
//   priority = '/assets/img/low_icon.svg';
//   changeColor(buttonId);
// }


function selectCategoryEditPopup(category) {
  let categoryColor;
  if (category === 'User Story') {
    categoryColor = '#0038ff';
  } else if (category === 'Technical Task') {
    categoryColor = '#1fd7c1';
  }

  document.getElementById('category-dropdown-popup').innerText = category;
  document.getElementById('category-dropdown-popup').style.background = categoryColor;
}


function selectPriorityEditPopup(priorityIcon, priorityText) {
  let dropdown = document.querySelector('#edit-task-priority-container-popup .dropdown-popup');
  dropdown.innerHTML = `${priorityText} <img src="${priorityIcon}" alt="Priority Icon"/>`;
}


function saveEditedPopupTask(taskId) {
  
  let editTitle = document.getElementById('edit-task-title-container-popup').value;
  let editDescription = document.getElementById('edit-task-description-container-popup').value;
  let editDate = document.getElementById('edit-task-date-container-popup').value;
  let editCategory = document.querySelector('#edit-task-category-container-popup .dropdown-popup').innerText;
  let editPriority = document.querySelector('#edit-task-priority-container-popup .dropdown-popup img').src;
  let editPriorityText = document.querySelector('#edit-task-priority-container-popup .dropdown-popup').innerText.split(' ')[0];
  
  let editCategoryColor;
  if (editCategory === 'User Story') {
    editCategoryColor = '#0038ff';
  } else if (editCategory === 'Technical Task') {
    editCategoryColor = '#1fd7c1';
  } else {
    editCategoryColor = '#ffffff';
  }

  let task = {
    taskTitle: editTitle,
    taskDescription: editDescription,
    taskDate: editDate,
    taskSubTask: subtasksEdit,
    taskCategory: editCategory,
    taskCategoryColor: editCategoryColor,
    taskPriority: editPriority,
    taskPriorityText: editPriorityText,
    taskAssignment: selectedContactsEdit,
    taskBoardCategory: boardCategory[0]
  };

  let database = firebase.database();
  let editedTask = database.ref('tasks').child(taskId);
  editedTask.update(task);

  document.getElementById('task-popup-edit-container').innerHTML = "";
  selectedContactsEdit = [];
  subtasksEdit = [];
}


function toggleSubtaskDoneInTask(taskId, subtaskIndex) {
  let taskRef = database.ref('tasks/' + taskId + '/taskSubTask/' + subtaskIndex);
  taskRef.once('value', function(snapshot) {
    let subtask = snapshot.val();
    subtask.done = !subtask.done;
    taskRef.set(subtask);
  });
}


function addSubtaskField() {
  const subtasksContainer = document.getElementById('edit-subtasks');
  const subtaskIndex = subtasksContainer.children.length;
  const newSubtaskHTML = /*html*/ `
    <div class="subtask">
      <input type="checkbox" id="edit-subtask-${subtaskIndex}">
      <input type="text" id="edit-subtask-name-${subtaskIndex}" placeholder="New Subtask">
    </div>`;
  subtasksContainer.insertAdjacentHTML('beforeend', newSubtaskHTML);
}


function closePopup() {
  let taskDetails = document.getElementById('task');
  taskDetails.style.display = 'none';
}

function closePopupBoard() {
  let taskDetails = document.getElementById('main-container-popup-board');
  if(taskDetails.classList.contains('d-none')) {
    taskDetails.classList.remove('d-none');
    taskDetails.classList.add('d-flex');
  } else if (taskDetails.classList.contains('d-flex')) {
    taskDetails.classList.remove('d-flex');
    taskDetails.classList.add('d-none');
  }
}


function doNotClose(event) {
  event.stopPropagation();
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


function filterTask() {
  let filterValue = document.getElementById('filterTaskInput').value.toUpperCase();
  let tasks = document.querySelectorAll('.task-board-container');

  tasks.forEach(task => {
      let title = task.querySelector('#task-title-container span').textContent.toUpperCase();
      let description = task.querySelector('#task-description-container span').textContent.toUpperCase();
      let category = task.querySelector('#task-category-container').textContent.toUpperCase();

      if (title.includes(filterValue) || description.includes(filterValue) || category.includes(filterValue)) {
          task.style.display = '';
      } else {
          task.style.display = 'none';
      }
  });
}


function showAddTaskPopupBoard() {
  document.getElementById('main-container-popup-board').classList.remove('d-none');
  document.getElementById('main-container-popup-board').classList.add('d-flex');
  // setTimeout(() => {
  //   document.getElementById('task-task-form').classList.add('animate-popup-addtask-container');
  // }, 125);
}


function hideAddTaskPopupBoard() {
  document.getElementById('main-container-popup-board').classList.remove('d-flex');
  document.getElementById('main-container-popup-board').classList.add('d-none');
}

