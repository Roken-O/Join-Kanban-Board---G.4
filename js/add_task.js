let selectedCategory = '';
let selectedContacts = [];
let selectedContactsEdit = [];
let allContacts = [];
let subtasks = [];
let subtasksEdit = [];
let allTasks = [];


function init() {
  loadContactList();
  loadTasks();
  setMinDateDatepicker();
}


function deleteTask(taskId) {
  let database = firebase.database();
  let taskRef = database.ref('tasks/' + taskId);
  taskRef.remove();
}


function saveTask() {
  let title = document.getElementById('task-trial-title').value;
  let description = document.getElementById('task-trial-description').value;
  let dueDate = document.getElementById('task-trial-date-picker').value;

  let task = {
    'taskCategory': selectedCategory,
    'taskTitle': title,
    'taskDescription': description,
    'taskDate': dueDate,
    'taskPriority': priority,
    'taskAssignment': selectedContacts,
    'taskSubTask': subtasks
  };

  let database = firebase.database();
  let newTask = database.ref('tasks').push();
  newTask.set(task);
  clearInputsAndArrays();
  subtasks = [];
  displaySubTasks();
  selectedContacts = [];
  selectedCategory = '';
  document.getElementById('task-trial-category-selection').innerText = "Category";
  priority = '';
  dueDate = date.datepicker( "option" , {setDate: null, minDate: null, maxDate: null} ); 
}


function clearInputsAndArrays() {
  document.getElementById('task-trial-title').value = "";
  document.getElementById('task-trial-description').value = "";
  document.getElementById('task-trial-subtask-input').value = "";
}


function addSubTask() {
  let subTaskInput = document.getElementById('task-trial-subtask-input');
  let subTaskValue = subTaskInput.value.trim();

  if (subTaskValue !== "") {
      subtasks.push(subTaskValue);
      subTaskInput.value = "";
      displaySubTasks();
  }
}


function displaySubTasks() {
  let subtaskList = document.getElementById('subtask-list');
  subtaskList.innerHTML = "";

  subtasks.forEach((subtask, index) => {
      let subtaskItem = document.createElement('li');
      subtaskItem.innerHTML = /*html*/ `${subtask} <button type="button" onclick="removeSubTask(${index})">X</button>`;
      subtaskList.appendChild(subtaskItem);
  });
}


function removeSubTask(index) {
  subtasks.splice(index, 1);
  displaySubTasks();
}


function loadTasks() {
  let database = firebase.database();
  let tasks = database.ref('tasks');

  tasks.on('value', function(snapshot) {
    let taskContainer = document.getElementById('task-trial-container');
    taskContainer.innerHTML = "";
    allTasks = [];
    
    snapshot.forEach(function(childSnapshot) {
      let task = childSnapshot.val();
      task.taskId = childSnapshot.key;  
      allTasks.push(task);

      let assignedContacts = task.taskAssignment ? task.taskAssignment.map(contact => contact.name).join(', ') : 'No contacts assigned';
      let dateParts = task.taskDate.split('-');
      let formDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
      let subtasks = task.taskSubTask ? task.taskSubTask.join(', ') : 'No subtasks';

      taskContainer.innerHTML += /*html*/ `
            <div id="task-trial-board-container">
                <div class="task-item-output" id="task-trial-category-container">${task.taskCategory}</div>
                <div class="task-item-output" id="task-trial-title-container">${task.taskTitle}</div>
                <div class="task-item-output" id="task-trial-description-container">${task.taskDescription}</div>
                <div class="task-item-output" id="formatted-date-display">Due date: ${formDate}</div>
                <div class="task-item-output" id="task-trial-priority-container"><img src="${task.taskPriority}" id="task-trial-priority-icon-task" alt="Priority Icon"/></div>
                <div class="task-item-output" id="task-trial-assignment-container">Assigned to: ${assignedContacts}</div>
                <div class="task-item-output" id="task-trial-subtask-container">Subtasks: ${subtasks}</div>
                <div id="task-trial-button-container">
                    <div id="task-trial-delete-button"><img style="height: 16px;" src="/assets/img/delete_icon.svg" alt="" /><button onclick="deleteTask('${task.taskId}')">Delete</button></div>
                    <div id="task-trial-edit-button"><img style="height: 16px;" src="/assets/img/pen_DARK.svg" alt="" /><button onclick="editTask('${task.taskId}')">Edit</button></div>
                </div>
            </div>`;
    });
  });
}


function editTask(taskId) {
  let editTask = document.getElementById('task-edit-container');
  let currentTitle;
  let currentDescription;
  let currentDate;
  let currentSubTask;
  let currentCategory;
  let currentPriority;
  let currentSelection;

  for (let i = 0; i < allTasks.length; i++) {
    if (taskId === allTasks[i]['taskId']) {
      currentTitle = allTasks[i]['taskTitle'];
      currentDescription = allTasks[i]['taskDescription'];
      currentDate = allTasks[i]['taskDate'];
      currentSubTask = allTasks[i]['taskSubTask'] || [];
      currentCategory = allTasks[i]['taskCategory'] || '';
      currentPriority = allTasks[i]['taskPriority'] || '';
      currentSelection = allTasks[i]['taskAssignment'] || [];
      break;
    }
  }

  let contactsList = '';
  allContacts.forEach(contact => {
    let isChecked = currentSelection.some(selectedContact => selectedContact.email === contact.email);
    contactsList += /*html*/ `
      <div class="dropdown-item">
        <input type="checkbox" id="${contact.email}-edit" value="${contact.email}" onclick="toggleContactEdit(this)" ${isChecked ? 'checked' : ''}>
        <label for="${contact['email']}-edit">${contact['name']}</label>
      </div>
    `;
  });

  editTask.innerHTML = /*html*/ `
    <input type="text" id="edit-task-title-container" value="${currentTitle}">
    <input type="text" id="edit-task-description-container" value="${currentDescription}">
    <input type="date" id="edit-task-date-container" value="${currentDate}">
    <input type="text" id="edit-task-subtask-container" value="${currentSubTask.join(', ')}">
    <input type="text" id="edit-task-subtask-input" placeholder="Subtask">
    <button type="button" onclick="addSubTaskEdit()">Add Subtask</button>
    <ul id="subtask-list-edit"></ul>
    <div id="edit-task-category-container" class="dropdown">
      <div class="dropbtn">${currentCategory}</div>
      <div id="categoryDropdown" class="dropdown-content">
        <div onclick="selectCategoryEdit('Technical Task')">Technical Task</div>
        <div onclick="selectCategoryEdit('User Story')">User Story</div>
      </div>
    </div>
    <div id="edit-task-priority-container" class="dropdown">
      <div class="dropbtn"><img src="${currentPriority}" alt="Priority Icon"/></div>
      <div id="priorityDropdown" class="dropdown-content">
        <div onclick="selectPriorityEdit('/assets/img/urgent_icon.png')">Urgent</div>
        <div onclick="selectPriorityEdit('/assets/img/medium_icon.svg')">Medium</div>
        <div onclick="selectPriorityEdit('/assets/img/low_icon.svg')">Low</div>
      </div>
    </div>
    <div id="edit-task-assignment-container" class="dropdown">
      <button class="dropbtn">Assign Contacts</button>
      <div id="contactsDropdown" class="dropdown-content">
        ${contactsList}
      </div>
    </div>
    <button onclick="saveEditedTask('${taskId}')">Save</button>
  `;

  selectedContactsEdit = currentSelection.slice();
  subtasksEdit = currentSubTask.slice();

  displaySubTasksEdit();
}


function addSubTaskEdit() {
  let subTaskInputEdit = document.getElementById('edit-task-subtask-input');
  let subTaskValueEdit = subTaskInputEdit.value.trim();

  if (subTaskValueEdit !== "") {
    subtasksEdit.push(subTaskValueEdit);
    subTaskInputEdit.value = "";
    displaySubTasksEdit();
  }
}


function displaySubTasksEdit() {
  let subtaskListEdit = document.getElementById('subtask-list-edit');
  subtaskListEdit.innerHTML = "";

  subtasksEdit.forEach((subtask, index) => {
    let subtaskItemEdit = document.createElement('li');
    subtaskItemEdit.innerHTML = /*html*/ `${subtask} <button type="button" onclick="removeSubTaskEdit(${index})">X</button>`;
    subtaskListEdit.appendChild(subtaskItemEdit);
  });
}


function removeSubTaskEdit(index) {
  subtasksEdit.splice(index, 1);
  displaySubTasksEdit();
}


function saveEditedTask(taskId) {
  let editTitle = document.getElementById('edit-task-title-container').value;
  let editDescription = document.getElementById('edit-task-description-container').value;
  let editDate = document.getElementById('edit-task-date-container').value;
  let editCategory = document.querySelector('#edit-task-category-container .dropbtn').innerText;
  let editPriority = document.querySelector('#edit-task-priority-container .dropbtn img').src;

  let task = {
    'taskTitle': editTitle,
    'taskDescription': editDescription,
    'taskDate': editDate,
    'taskSubTask': subtasksEdit,
    'taskCategory': editCategory,
    'taskPriority': editPriority,
    'taskAssignment': selectedContactsEdit
  };

  let database = firebase.database();
  let newTaskEntry = database.ref("tasks/" + taskId);
  newTaskEntry.set(task)
  loadTasks();
}


function loadContactList() {
  let database = firebase.database();
  let contactEntries = database.ref('contacts');

  contactEntries.on('value', function(snapshot) {
      let contactsList = document.getElementById('contacts-trial-contacts-list');
      contactsList.innerHTML = "";

      allContacts = [];
      snapshot.forEach(function(childSnapshot) {
          let contact = childSnapshot.val();
          allContacts.push(contact);

          contactsList.innerHTML += /*html*/ `
              <div class="dropdown-item">
                  <input type="checkbox" id="${contact['email']}" value="${contact.email}" onclick="toggleContactAssignment(this)">
                  <label for="${contact['email']}">${contact['name']}</label>
              </div>`;
      });
  });
}


function toggleContactEdit(checkbox) {
  let contactEmail = checkbox.value;
  if (checkbox.checked) {
    let contact = allContacts.find(contact => contact['email'] === contactEmail);
    selectedContactsEdit.push(contact);
  } else {
    selectedContactsEdit = selectedContactsEdit.filter(contact => contact['email'] !== contactEmail);
  }
}


function toggleContactDropdown() {
  let contactsDropdown = document.getElementById('contacts-trial-contacts-list');
  let dropdownArrow = document.getElementById('icon-contacts-dropdown-arrow-image');

  if (contactsDropdown.classList.contains('d-none')) {
      contactsDropdown.classList.remove('d-none');
      dropdownArrow.src = "/assets/img/dropdown_up.svg";
  } else {
      contactsDropdown.classList.add('d-none');
      dropdownArrow.src = "/assets/img/dropdown_down.svg";
  }
}


function toggleCategoryDropdown() {
  let categoryDropdown = document.getElementById('task-trial-category-dropdown');
  let dropdownArrow = document.getElementById('icon-dropdown-arrow-image');

  if (categoryDropdown.classList.contains('d-none')) {
      categoryDropdown.classList.remove('d-none');
      dropdownArrow.src = "/assets/img/dropdown_up.svg";
  } else {
      categoryDropdown.classList.add('d-none');
      dropdownArrow.src = "/assets/img/dropdown_down.svg";
  }
}


function selectCategory(event, category) {
  selectedCategory = category;
  document.getElementById('task-trial-category-selection').innerText = selectedCategory;
  document.getElementById('task-trial-category-dropdown').classList.add('d-none');
  document.getElementById('icon-dropdown-arrow-image').src = "/assets/img/dropdown_down.svg";
}


function createCategoryIconUrgent() {
  priority = '/assets/img/urgent_icon.svg';
}


function createCategoryIconMedium() {
  priority = '/assets/img/medium_icon.svg';
}


function createCategoryIconLow() {
  priority = '/assets/img/low_icon.svg';
}


function selectCategoryEdit(category) {
  document.querySelector('#edit-task-category-container .dropbtn').innerText = category;
}


function selectPriorityEdit(priorityIcon) {
  document.querySelector('#edit-task-priority-container .dropbtn img').src = priorityIcon;
}


function setMinDateDatepicker() {
  let today = new Date();
  let tt = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let jjjj = today.getFullYear();

  let unformDate = jjjj + '-' + mm + '-' + tt;
  document.getElementById('task-trial-date-picker').min = unformDate;
  document.getElementById('task-trial-date-picker').value = unformDate;
}
