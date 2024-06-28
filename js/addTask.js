let selectedCategory = '';
let selectedContacts = [];
let selectedContactsEdit = [];
let allContacts = [];
let subtasks = [];
let subtasksEdit = [];
let allTasks = [];
let boardCategory = ['toDo', 'awaitFeedback', 'inProgress', 'done']


function initTask() {
    includeHTML();
//   loadContactList();
//   loadTasks();
  setMinDateDatepicker();
}


function deleteTask(taskId) {
  let database = firebase.database();
  let taskRef = database.ref('tasks/' + taskId);
  taskRef.remove();
}


let getInitials = function (string) {
  if (!string || typeof string !== 'string') {
    return ''; 
  }
  let name = string.split(" ");
  let initials = name[0].substring(0, 1).toUpperCase();
  if (name.length > 1) {
    initials += name[name.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};


let getInitialsList = function (names) {
  if (!Array.isArray(names)) {
    return []; 
  }
  return names.map(name => getInitials(name));
};


function saveTask() {
  let title = document.getElementById('task-title').value;
  let description = document.getElementById('task-description').value;
  let dueDate = document.getElementById('task-date-picker').value;
  let categoryColor;
  if (selectedCategory === 'User Story') {
    categoryColor = '#0038ff';
  } else if (selectedCategory === 'Technical Task') {
    categoryColor = '#1fd7c1';
  }

  let priorityText;
  if (priority === '/assets/img/urgent_icon.svg') {
    priorityText = 'Urgent';
  } else if (priority === '/assets/img/medium_icon.svg') {
    priorityText = 'Medium';
  } else if (priority === '/assets/img/low_icon.svg') {
    priorityText = 'Low';
  }

  let task = {
    taskCategory: selectedCategory,
    taskCategoryColor: categoryColor,
    taskTitle: title,
    taskDescription: description,
    taskDate: dueDate,
    taskPriority: priority,
    taskPriorityText: priorityText,
    taskAssignment: selectedContacts,
    taskSubTask: subtasks,
    taskBoardCategory: boardCategory[0]
  };

  let database = firebase.database();
  let newTask = database.ref('tasks').push();
  newTask.set(task);

  clearInputsAndArrays();
  subtasks = [];
  displaySubTasks();
  selectedContacts = [];
  selectedCategory = '';
  document.getElementById('task-category-selection').innerText = "Category";
  priority = '';
}


function clearInputsAndArrays() {
  document.getElementById('task-title').value = "";
  document.getElementById('task-description').value = "";
  document.getElementById('task-subtask-input').value = "";
}


function addSubTask() {
  let subTaskInput = document.getElementById('task-subtask-input');
  let subTaskValue = subTaskInput.value.trim();

  if (subTaskValue !== "") {
    let subTask = {
      name: subTaskValue,
      done: false
    };
    subtasks.push(subTask);
    subTaskInput.value = "";
    displaySubTasks();
  }
}


function displaySubTasks() {
  let subtaskList = document.getElementById('subtask-list');
  subtaskList.innerHTML = "";

  subtasks.forEach((subtask, index) => {
    let subtaskItem = document.createElement('li');
    subtaskItem.innerHTML = /*html*/`
      <input class="d-none" type="checkbox" id="subtask-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtaskDone(${index})">
      <label for="subtask-${index}">${subtask.name}</label>
      <img src="/assets/img/delete_icon.png" type="button" onclick="removeSubTask(${index})">
    `;
    subtaskList.appendChild(subtaskItem);
  });
}


function removeSubTask(index) {
  subtasks.splice(index, 1);
  displaySubTasks();
}


function editTask(taskId) {
  let editTask = document.getElementById('task-edit-container');
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
        <div style="display: flex; align-items:center; justify-content: center; background: ${contact['color']}; height: 40px; width: 40px; border-radius: 40px; cursor: pointer;" id="contact-badge-list">${getInitials(contact['name'])}</div>
        <label for="${contact['email']}">${contact['name']}</label>
        <input type="checkbox" id="${contact['email']}" value="${contact['email']}" onclick="toggleContactEdit(this)" ${isChecked ? 'checked' : ''}>
      </div>
    `;
  });

  editTask.innerHTML = /*html*/ `
    <input type="text" id="edit-task-title-container" value="${currentTitle}">
    <input type="text" id="edit-task-description-container" value="${currentDescription}">
    <input type="date" id="edit-task-date-container" value="${currentDate}">
    <input type="text" id="edit-task-subtask-input" placeholder="Subtask">
    <button type="button" onclick="addSubTaskEdit()">Add Subtask</button>
    <ul id="subtask-list-edit"></ul>
    <div id="edit-task-category-container" class="dropdown">
      <div class="dropbtn" id="categoryDropBtn" style="background: ${currentCategoryColor}">${currentCategory}</div>
      <div id="categoryDropdown" class="dropdown-content">
        <a href="#" onclick="selectCategoryEdit('Technical Task')">Technical Task</a>
        <a href="#" onclick="selectCategoryEdit('User Story')">User Story</a>
      </div>
    </div>
    <div id="edit-task-priority-container" class="dropdown">
      <div class="dropbtn">${currentPriorityText} <img src="${currentPriority}" alt="Priority Icon"/></div>
      <div id="priorityDropdown" class="dropdown-content">
        <a href="#" onclick="selectPriorityEdit('/assets/img/urgent_icon.svg', 'Urgent')">Urgent</a>
        <a href="#" onclick="selectPriorityEdit('/assets/img/medium_icon.svg', 'Medium')">Medium</a>
        <a href="#" onclick="selectPriorityEdit('/assets/img/low_icon.svg', 'Low')">Low</a>
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
    let subTask = {
      name: subTaskValueEdit,
      done: false
    };
    subtasksEdit.push(subTask);
    subTaskInputEdit.value = "";
    displaySubTasksEdit();
  }
}


function displaySubTasksEdit() {
  let subtaskListEdit = document.getElementById('subtask-list-edit');
  subtaskListEdit.innerHTML = "";

  subtasksEdit.forEach((subtask, index) => {
    let subtaskItemEdit = document.createElement('li');
    subtaskItemEdit.innerHTML = /*html*/`
      <input type="checkbox" id="subtask-edit-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtaskDoneEdit(${index})">
      <label for="subtask-edit-${index}">${subtask.name}</label>
      <button type="button" onclick="removeSubTaskEdit(${index})">X</button>
    `;
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

  let editCategoryColor;
  if (editCategory === 'User Story') {
    editCategoryColor = '#0038ff';
  } else if (editCategory === 'Technical Task') {
    editCategoryColor = '#1fd7c1';
  } else {
    editCategoryColor = '#ffffff';
  }

  let editPriority = document.querySelector('#edit-task-priority-container .dropbtn img').src;
  let editPriorityText = document.querySelector('#edit-task-priority-container .dropbtn').innerText.split(' ')[0];

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

  document.getElementById('task-edit-container').innerHTML = "";
  selectedContactsEdit = [];
  subtasksEdit = [];
}


function loadContactList() {
  let database = firebase.database();
  let contactEntries = database.ref('contacts');

  contactEntries.on('value', function(snapshot) {
      let contactsList = document.getElementById('contacts-list');
      contactsList.innerHTML = "";

      allContacts = [];
      snapshot.forEach(function(childSnapshot) {
          let contact = childSnapshot.val();
          allContacts.push(contact);

          contactsList.innerHTML += /*html*/ `
              <div class="dropdown-item">
                <div style="display: flex; align-items:center; justify-content: center; background: ${contact['color']}; height: 40px; width: 40px; border-radius: 40px; cursor: pointer;" id="contact-badge-list">${getInitials(contact['name'])}</div>
                <label for="${contact['email']}">${contact['name']}</label>
                <input type="checkbox" id="${contact['email']}" value="${contact['email']}" onclick="toggleContactAssignment(this)">
              </div>`;
      });
  });
}


function toggleContactEdit(checkbox) {
  let contactEmail = checkbox.value;
  if (checkbox.checked) {
    let contact = allContacts.find(contact => contact.email === contactEmail);
    selectedContactsEdit.push(contact);
  } else {
    selectedContactsEdit = selectedContactsEdit.filter(contact => contact.email !== contactEmail);
  }
}


function toggleContactAssignment(checkbox) {
  let contactEmail = checkbox.value;
  if (checkbox.checked) {
    let contact = allContacts.find(contact => contact['email'] === contactEmail);
    selectedContacts.push(contact);
  } else {
    selectedContacts = selectedContacts.filter(contact => contact['email'] !== contactEmail);
  }
}


function toggleContactDropdown() {
  let contactsDropdown = document.getElementById('contacts-list');
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
  let categoryDropdown = document.getElementById('task-category-dropdown');
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
  document.getElementById('selected-category-container').innerText = selectedCategory;
  document.getElementById('task-category-dropdown').classList.add('d-none');
  document.getElementById('icon-dropdown-arrow-image').src = "/assets/img/dropdown_down.svg";
}


function createCategoryIconUrgent(buttonId) {
  priority = '/assets/img/urgent_icon.svg';
  changeColor(buttonId);

}


function createCategoryIconMedium(buttonId) {
  priority = '/assets/img/medium_icon.svg';
  changeColor(buttonId);
}


function createCategoryIconLow(buttonId) {
  priority = '/assets/img/low_icon.svg';
  changeColor(buttonId);
}

function changeColor(buttonId) {
  resetButtons();

  if (buttonId === 'priority-urgent-text') {
      document.getElementById('priority-urgent-text').style.backgroundColor = '#ff3d00';
      document.getElementById('priority-urgent-text').style.color = 'white';
      document.getElementById('task-urgent-icon').src = '/assets/img/urgent_icon_WHT.png';

  } else if (buttonId === 'priority-medium-text') {
      document.getElementById('priority-medium-text').style.backgroundColor = '#ffa800';
      document.getElementById('priority-medium-text').style.color = 'white';
      document.getElementById('task-medium-icon').src = '/assets/img/medium_icon_WHT.png';

  } else if (buttonId === 'priority-low-text') {
      document.getElementById('priority-low-text').style.backgroundColor = '#7ae229';
      document.getElementById('priority-low-text').style.color = 'white';
      document.getElementById('task-low-icon').src = '/assets/img/low_icon_WHT.png';
  // const buttons = [
  //     { id: 'btn1', color: '#ff3d00' },
  //     { id: 'btn2', color: '#ff7a800' },l
  //     { id: 'btn3', color: '#7ae229' }
  // ];
  // for (const button of buttons) { //button Schleifenvariable; buttons = Array
  //     if (button.id === buttonId) {
  //         document.getElementById(button.id).style.backgroundColor = button.color;
  //         document.getElementById(button.id).style.color = 'white';
  //     }
  // }
  // document.getElementById(path1Id).classList.add('cls-13');
  // document.getElementById(path2Id).classList.add('cls-13');
}
}

function resetButtons() {
  // Buttons zurücksetzen
  document.getElementById('priority-urgent-text').style.backgroundColor = 'white';
  document.getElementById('priority-urgent-text').style.color = 'black';
  document.getElementById('task-urgent-icon').src = '/assets/img/urgent_icon.png';

  document.getElementById('priority-medium-text').style.backgroundColor = 'white';
  document.getElementById('priority-medium-text').style.color = 'black';
  document.getElementById('task-medium-icon').src = '/assets/img/medium_icon.png';

  document.getElementById('priority-low-text').style.backgroundColor = 'white';
  document.getElementById('priority-low-text').style.color = 'black';
  document.getElementById('task-low-icon').src = '/assets/img/low_icon.png';


//   let paths = ['urgent-path1', 'urgent-path2','medium-path1', 'medium-path2','low-path1', 'low-path2'];
//   for (let i = 0; i < paths.length; i++) {
//       document.getElementById(paths[i]).classList.remove('cls-13');
//   const buttons = ['btn1', 'btn2', 'btn3'];
//   for (const id of buttons) {
//       document.getElementById(id).style.backgroundColor = 'white';
//       document.getElementById(id).style.color = 'black';
//   }
// }
}

function selectCategoryEdit(category) {
  let categoryColor;

  if (category === 'User Story') {
    categoryColor = '#0038ff';
  } else if (category === 'Technical Task') {
    categoryColor = '#1fd7c1';
  }
  document.getElementById('categoryDropBtn').innerText = category;
  document.getElementById('categoryDropBtn').style.background = categoryColor;
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
  document.getElementById('task-date-picker').min = unformDate;
  document.getElementById('task-date-picker').value = unformDate;
}

    // animation
    function animateButton() {
        document.getElementById('alertMessage').style.display = "flex";
        let alertMessage = document.getElementById("popup-message");

        setTimeout(() => {
            alertMessage.classList.add('translateNull');
            setTimeout(() => {
                alertMessage.classList.remove('translateNull');
                document.getElementById('alertMessage').style.display = "none";
            }, 2000);
        }, 250);
    }

        // clear-button
        function changeCleaningColor() {
            document.querySelector('#close_icon .cls-20').style.fill = '#00bee8';
        }
    
        function changeCleaningColorToStandard() {
            document.querySelector('#close_icon .cls-20').style.fill = '#2a3647';
        }
    

        function showCheckAndCloseIcons(){
          document.getElementById('icon-plus-image').style.display = "none";
          document.getElementById('icon-check-image').style.display = "flex";
          document.getElementById('seperator-container').style.display = "flex";
          document.getElementById('icon-close-image').style.display = "flex";
        }
        function showPlusIcon(){
          document.getElementById('icon-plus-image').style.display = "flex";
          document.getElementById('icon-check-image').style.display = "none";
          document.getElementById('seperator-container').style.display = "none";
          document.getElementById('icon-close-image').style.display = "none";
        }