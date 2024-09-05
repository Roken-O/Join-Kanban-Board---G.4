let selectedCategory = '';
let selectedContacts = [];
let selectedContactsEdit = [];
let allContacts = [];
let subtasks = [];
let subtasksEdit = [];
let allTasks = [];
let boardCategory = ['toDo', 'awaitFeedback', 'inProgress', 'done'];

function initTask() {
  loadContactList();
  setMinDateDatepicker();
  loadLocalStorage();
  checkRegisteredUser();
  createCategoryIconMedium(event, 'priority-medium-text');
  changeColor('priority-medium-text');
}

/**
 * Deletes a task from the Firebase database.
 * @param {string} taskId - The ID of the task to delete.
 */
function deleteTask(taskId) {
  let database = firebase.database();
  let taskRef = database.ref('tasks/' + taskId);
  taskRef.remove();
}

/**
 * Retrieves the initials from a string.
 * @param {string} string - The string from which to extract initials.
 * @returns {string} The initials extracted from the string.
 */
let getInitials = function (string) {
  if (!string || typeof string !== 'string') {
    return '';
  }
  let name = string.split(' ');
  let initials = name[0].substring(0, 1).toUpperCase();
  if (name.length > 1) {
    initials += name[name.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

/**
 * Generates a list of initials from an array of names.
 * @param {string[]} names - An array of names.
 * @returns {string[]} An array of initials corresponding to the names.
 */
let getInitialsList = function (names) {
  if (!Array.isArray(names)) {
    return [];
  }
  return names.map((name) => getInitials(name));
};

/**
 * Validates the task form inputs.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateTaskForm() {
  let title = document.getElementById('task-title').value.trim();
  let selectedCategory = document.getElementById('selected-category-container').innerText.trim();
  let assignedContacts = document.getElementById('contacts-initial').childElementCount > 0;

  if (title === '') {
    return false;
  } else if (!assignedContacts) {
    animateAlertContacts();
    return false;
  } else if (priority === '') {
    animateAlertPriority();
    return false;
  } else if (selectedCategory === 'Select task category' || selectedCategory === '') {
    animateAlertCategory();
    return false;
  }

  return true;
}

/**
 * Saves a new task to the Firebase database.
 */
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

  if (priority === './assets/img/urgent_icon.svg') {
    priorityText = 'Urgent';
  } else if (priority === './assets/img/medium_icon.svg') {
    priorityText = 'Medium';
  } else if (priority === './assets/img/low_icon.svg') {
    priorityText = 'Low';
  }

  let task = { taskCategory: selectedCategory, taskCategoryColor: categoryColor, taskTitle: title, taskDescription: description, taskDate: dueDate, taskPriority: priority, taskPriorityText: priorityText, taskAssignment: selectedContacts, taskSubTask: subtasks, taskBoardCategory: boardCategory[0] };

  let database = firebase.database();
  let newTask = database.ref('tasks').push();
  newTask.set(task);
  subtasks = [];
  displaySubTasks();
  selectedContacts = [];
  selectedCategory = '';
  document.getElementById('task-category-selection').innerText = 'Category';
  priority = '';
  clearInputsAndArrays();
  animateButton();
}

/**
 * Clears input fields and resets arrays used in the task form.
 */
function clearInputsAndArrays() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-subtask-input').value = '';
  document.getElementById('contacts-initial').innerHTML = '';
  document.getElementById('selected-category-container').innerText = 'Select task category';
  document.getElementById('subtask-list').innerHTML = '';
  setMinDateDatepicker();
  changeColor('priority-medium-text');
}

/**
 * Adds a subtask to the current task.
 */
function addSubTask() {
  let subTaskInput = document.getElementById('task-subtask-input');
  let subTaskValue = subTaskInput.value.trim();
  if (subTaskValue !== '') {
    let subTask = {
      name: subTaskValue,
      done: false,
    };
    subtasks.push(subTask);
    subTaskInput.value = '';
    displaySubTasks();
  }
}

/**
 * Displays the current list of subtasks in the UI.
 */
function displaySubTasks() {
  let subtaskList = document.getElementById('subtask-list');
  subtaskList.innerHTML = '';
  checkSubTasksLength();
  subtasks.forEach((subtask, index) => {
    let subtaskItem = document.createElement('li');
    subtaskItem.innerHTML = /*html*/ `
      <input class="d-none" type="checkbox" id="subtask-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtaskDone(${index})">
      <label for="subtask-${index}">${subtask.name}</label>
      <img src="./assets/img/delete_icon.svg" type="button" onclick="removeSubTask(${index})">
    `;
    subtaskList.appendChild(subtaskItem);
  });
}

/**
 * Checks the length of the subtask list and adjusts the display height if needed.
 */
function checkSubTasksLength() {
  let subtaskList = document.getElementById('subtask-list');
  if (subtasks.length > 3) {
    subtaskList.style.height = '90px';
    subtaskList.style.overflowY = 'auto';
  } else {
    subtaskList.style.maxHeight = '';
    subtaskList.style.overflowY = '';
  }
}

/**
 * Removes a subtask from the list.
 * @param {number} index - The index of the subtask to remove.
 */
function removeSubTask(index) {
  subtasks.splice(index, 1);
  displaySubTasks();
}

/**
 * Loads the task data into the edit form for editing.
 * @param {string} taskId - The ID of the task to edit.
 */
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
  allContacts.forEach((contact) => {
    let isChecked = currentSelection.some((selectedContact) => selectedContact.email === contact.email);
    contactsList += /*html*/ `
      <div class="dropdown-item">
        <div style="display: flex; align-items:center; justify-content: center; background: ${contact['color']}; height: 40px; width: 40px; border-radius: 40px; cursor: pointer;" id="contact-badge-list">${getInitials(contact['name'])}</div>
        <label for="${contact['email']}">${contact['name']}</label>
        <input type="checkbox" id="${contact['email']}" value="${contact['email']}" onclick="toggleContactEdit(this)" ${isChecked ? 'checked' : ''}>
      </div>
    `;
  });

  editTask.innerHTML = `
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
        <a href="#" onclick="selectPriorityEdit('./assets/img/urgent_icon.svg', 'Urgent')">Urgent</a>
        <a href="#" onclick="selectPriorityEdit('./assets/img/medium_icon.svg', 'Medium')">Medium</a>
        <a href="#" onclick="selectPriorityEdit('./assets/img/low_icon.svg', 'Low')">Low</a>
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

/**
 * Adds a subtask to the edit form's list of subtasks.
 */
function addSubTaskEdit() {
  let subTaskInputEdit = document.getElementById('edit-task-subtask-input');
  let subTaskValueEdit = subTaskInputEdit.value.trim();

  if (subTaskValueEdit !== '') {
    let subTask = {
      name: subTaskValueEdit,
      done: false,
    };
    subtasksEdit.push(subTask);
    subTaskInputEdit.value = '';
    displaySubTasksEdit();
  }
}

/**
 * Displays the current list of subtasks in the edit form.
 */
function displaySubTasksEdit() {
  let subtaskListEdit = document.getElementById('subtask-list-edit');
  subtaskListEdit.innerHTML = '';

  subtasksEdit.forEach((subtask, index) => {
    let subtaskItemEdit = document.createElement('li');
    subtaskItemEdit.innerHTML = /*html*/ `
      <input type="checkbox" id="subtask-edit-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtaskDone(${index})">
      <label for="subtask-edit-${index}">${subtask.name}</label>
      <button type="button" onclick="removeSubTaskEdit(${index})">X</button>
    `;
    subtaskListEdit.appendChild(subtaskItemEdit);
  });
}

/**
 * Removes a subtask from the edit form's list of subtasks.
 * @param {number} index - The index of the subtask to remove.
 */
function removeSubTaskEdit(index) {
  subtasksEdit.splice(index, 1);
  displaySubTasksEdit();
}

/**
 * Saves the edited task to the Firebase database.
 * @param {string} taskId - The ID of the task to update.
 */
function saveEditedTask(taskId) {
  /** @type {string} */
  let editTitle = document.getElementById('edit-task-title-container').value;
  /** @type {string} */
  let editDescription = document.getElementById('edit-task-description-container').value;
  /** @type {string} */
  let editDate = document.getElementById('edit-task-date-container').value;
  /** @type {string} */
  let editCategory = document.querySelector('#edit-task-category-container .dropbtn').innerText;
  /** @type {string} */
  let editCategoryColor;
  if (editCategory === 'User Story') {
    editCategoryColor = '#0038ff';
  } else if (editCategory === 'Technical Task') {
    editCategoryColor = '#1fd7c1';
  } else {
    editCategoryColor = '#ffffff';
  }

  /** @type {string} */
  let editPriority = document.querySelector('#edit-task-priority-container .dropbtn img').src;
  /** @type {string} */
  let editPriorityText = document.querySelector('#edit-task-priority-container .dropbtn').innerText.split(' ')[0];

  /** @type {{taskTitle: string, taskDescription: string, taskDate: string, taskSubTask: Array<{name: string, done: boolean}>, taskCategory: string, taskCategoryColor: string, taskPriority: string, taskPriorityText: string, taskAssignment: Array<Object>, taskBoardCategory: string}} */
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
    taskBoardCategory: boardCategory[0],
  };

  let database = firebase.database();
  let editedTask = database.ref('tasks').child(taskId);
  editedTask.update(task);

  document.getElementById('task-edit-container').innerHTML = '';
  selectedContactsEdit = [];
  subtasksEdit = [];
}

/** @type {number} */
let i = 0;

/**
 * Loads the contact list from Firebase and displays it.
 */
function loadContactList() {
  let database = firebase.database();
  let contactEntries = database.ref('contacts');

  contactEntries.on('value', function (snapshot) {
    let contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';

    allContacts = [];
    snapshot.forEach(function (childSnapshot) {
      let contact = childSnapshot.val();
      allContacts.push(contact);
      contactsList.innerHTML += /*html*/ `
              <div class="dropdown-item" id="dropdown-item${i}">
                <div class="sub-dropdown-item">
                  <div style="display: flex; align-items:center; justify-content: center; background: ${contact['color']}; height: 40px; width: 40px; border-radius: 40px; cursor: pointer;" id="contact-badge-list">${getInitials(contact['name'])}</div>
                  <label for="${contact['email']}">${contact['name']}</label>
                </div>
                <input type="checkbox" id="${contact['email']}" value="${contact['email']}" onclick="toggleContactAssignment(this, 'dropdown-item${i}')">
              </div>`;
      i++;
    });
  });
}

/**
 * Toggles the selection of a contact in the edit form.
 * @param {HTMLInputElement} checkbox - The checkbox element that was clicked.
 */
function toggleContactEdit(checkbox) {
  let contactEmail = checkbox.value;
  if (checkbox.checked) {
    let contact = allContacts.find((contact) => contact.email === contactEmail);
    selectedContactsEdit.push(contact);
  } else {
    selectedContactsEdit = selectedContactsEdit.filter((contact) => contact.email !== contactEmail);
  }
}

/**
 * Toggles the contact assignment in the dropdown list.
 * @param {HTMLInputElement} checkbox - The checkbox element that was clicked.
 * @param {string} dropdownItemI - The ID of the dropdown item element.
 */
function toggleContactAssignment(checkbox, dropdownItemI) {
  let contactEmail = checkbox.value;
  if (checkbox.checked) {
    let contact = allContacts.find((contact) => contact['email'] === contactEmail);
    selectedContacts.push(contact);
    document.getElementById(`${dropdownItemI}`).style.backgroundColor = '#2a3647';
    document.getElementById(`${dropdownItemI}`).style.color = 'white';
  } else {
    selectedContacts = selectedContacts.filter((contact) => contact['email'] !== contactEmail);
    document.getElementById('contacts-initial').innerHTML += ``;
    document.getElementById(`${dropdownItemI}`).style.backgroundColor = '#f1f1f1';
    document.getElementById(`${dropdownItemI}`).style.color = 'black';
  }
}

/**
 * Shows the color initials of selected contacts or hides the initial container if no contacts are selected.
 */
function showInitialColor() {
  if (selectedContacts.length > 0) {
    document.getElementById('contacts-initial').innerHTML = '';

    for (let i = 0; i < selectedContacts.length; i++) {
      let contact = selectedContacts[i];
      document.getElementById('contacts-initial').innerHTML += `
      <div class="initial-container"  style="display: flex; align-items:center; justify-content: center; background: ${contact['color']}; color: white; height: 40px; width: 40px; border-radius: 40px; cursor: pointer;" id="contact-badge-list">${getInitials(contact['name'])}</div>`;
    }
  } else {
    document.getElementById('contacts-initial').style.display = 'none';
  }
}

/** @type {boolean} */
let isDropdownOpen = false;
/** @type {boolean} */
let isCategoryDropdownOpen = false;

/**
 * Toggles the visibility of the contacts dropdown.
 * @param {Event} event - The event triggered by the user action.
 */
function toggleContactDropdown(event) {
  event.stopPropagation();

  /** @type {HTMLDivElement} */
  let contactsDropdown = document.getElementById('contacts-list');
  /** @type {HTMLImageElement} */
  let dropdownArrow = document.getElementById('icon-contacts-dropdown-arrow-image');

  if (contactsDropdown.classList.contains('d-none')) {
    document.getElementById('contacts-initial').style.display = 'none';
    contactsDropdown.classList.remove('d-none');
    dropdownArrow.src = './assets/img/dropdown_up.svg';
    isDropdownOpen = true;
  } else {
    document.getElementById('contacts-initial').style.display = 'flex';
    contactsDropdown.classList.add('d-none');
    dropdownArrow.src = './assets/img/dropdown_down.svg';
    showInitialColor();
    isDropdownOpen = false;
  }

}

document.addEventListener('click', function (event) {
  /** @type {HTMLDivElement} */
  let contactsDropdown = document.getElementById('contacts-list');
  /** @type {HTMLDivElement} */
  let categoryDropdown = document.getElementById('task-category-dropdown');
  /** @type {HTMLImageElement} */
  let contactsDropdownArrow = document.getElementById('icon-contacts-dropdown-arrow-image');
  /** @type {HTMLImageElement} */
  let categoryDropdownArrow = document.getElementById('icon-dropdown-arrow-image');

  if (isDropdownOpen && !contactsDropdown.contains(event.target)) {
    document.getElementById('contacts-initial').style.display = 'flex';
    contactsDropdown.classList.add('d-none');
    contactsDropdownArrow.src = './assets/img/dropdown_down.svg';
    showInitialColor();
    isDropdownOpen = false;
  }

  if (isCategoryDropdownOpen && !categoryDropdown.contains(event.target)) {
    categoryDropdown.classList.add('d-none');
    categoryDropdownArrow.src = './assets/img/dropdown_down.svg';
    isCategoryDropdownOpen = false;
  }
});

/**
 * Toggles the visibility of the task category dropdown.
 * @param {Event} event - The event triggered by the user action.
 */
function toggleCategoryDropdown(event) {
  event.stopPropagation();

  /** @type {HTMLDivElement} */
  let categoryDropdown = document.getElementById('task-category-dropdown');
  /** @type {HTMLImageElement} */
  let dropdownArrow = document.getElementById('icon-dropdown-arrow-image');

  if (categoryDropdown.classList.contains('d-none')) {
    categoryDropdown.classList.remove('d-none');
    dropdownArrow.src = './assets/img/dropdown_up.svg';
    isCategoryDropdownOpen = true;
  } else {
    categoryDropdown.classList.add('d-none');
    dropdownArrow.src = './assets/img/dropdown_down.svg';
    isCategoryDropdownOpen = false;
  }
}

/**
 * Selects a task category and updates the dropdown display.
 * @param {Event} event - The event triggered by the user action.
 * @param {string} category - The selected task category.
 */
function selectCategory(event, category) {
  selectedCategory = category;
  document.getElementById('selected-category-container').innerText = selectedCategory;
  document.getElementById('task-category-dropdown').classList.add('d-none');
  document.getElementById('icon-dropdown-arrow-image').src = './assets/img/dropdown_down.svg';
}

/** @type {string} */
let priority = '';

/**
 * Sets the priority to 'Urgent' and updates the corresponding button's appearance.
 * @param {Event} event - The event triggered by the user action.
 * @param {string} buttonId - The ID of the button to update.
 */
function createCategoryIconUrgent(event, buttonId) {
  event.preventDefault();
  priority = './assets/img/urgent_icon.svg';
  changeColor(buttonId);
}

/**
 * Sets the priority to 'Medium' and updates the corresponding button's appearance.
 * @param {Event} event - The event triggered by the user action.
 * @param {string} buttonId - The ID of the button to update.
 */
function createCategoryIconMedium(event, buttonId) {
  event.preventDefault();
  priority = './assets/img/medium_icon.svg';
  changeColor(buttonId);
}

/**
 * Sets the priority to 'Low' and updates the corresponding button's appearance.
 * @param {Event} event - The event triggered by the user action.
 * @param {string} buttonId - The ID of the button to update.
 */
function createCategoryIconLow(event, buttonId) {
  event.preventDefault();
  priority = './assets/img/low_icon.svg';
  changeColor(buttonId);
}

/**
 * Updates the appearance of the priority buttons based on the selected button.
 * @param {string} buttonId - The ID of the button that was clicked.
 */
function changeColor(buttonId) {
  resetButtons();
  if (buttonId === 'priority-urgent-text') {
    document.getElementById('task-urgent-icon').src = './assets/img/urgent_icon_WHT.svg';
    document.getElementById('priority-urgent-text').style.backgroundColor = '#ff3d00';
    document.getElementById('priority-urgent-text').style.color = 'white';
  } else if (buttonId === 'priority-medium-text') {
    document.getElementById('task-medium-icon').src = './assets/img/medium_icon_WHT.svg';
    document.getElementById('priority-medium-text').style.backgroundColor = '#ffa800';
    document.getElementById('priority-medium-text').style.color = 'white';
  } else if (buttonId === 'priority-low-text') {
    document.getElementById('task-low-icon').src = './assets/img/low_icon_WHT.svg';
    document.getElementById('priority-low-text').style.backgroundColor = '#7ae229';
    document.getElementById('priority-low-text').style.color = 'white';
  }
}

/**
 * Resets the appearance of all priority buttons to their default state.
 */
function resetButtons() {
  document.getElementById('priority-urgent-text').style.backgroundColor = 'transparent';
  document.getElementById('priority-urgent-text').style.color = 'rgba(42, 54, 71, 1)';
  document.getElementById('task-urgent-icon').src = './assets/img/urgent_icon.svg';
  document.getElementById('priority-medium-text').style.backgroundColor = 'transparent';
  document.getElementById('priority-medium-text').style.color = 'rgba(42, 54, 71, 1)';
  document.getElementById('task-medium-icon').src = './assets/img/medium_icon.svg';
  document.getElementById('priority-low-text').style.backgroundColor = 'transparent';
  document.getElementById('priority-low-text').style.color = 'rgba(42, 54, 71, 1)';
  document.getElementById('task-low-icon').src = './assets/img/low_icon.svg';
}

/**
 * Selects a task category for the edit form and updates the display.
 * @param {string} category - The selected task category.
 */
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

/**
 * Updates the priority icon in the edit form.
 * @param {string} priorityIcon - The URL of the priority icon image.
 */
function selectPriorityEdit(priorityIcon, priorityText) {
  let priorityContainer = document.querySelector('#edit-task-priority-container .dropbtn');
  priorityContainer.innerHTML = `${priorityText} <img src="${priorityIcon}" alt="Priority Icon"/>`;
}

/**
 * Sets the minimum date for the date picker to today.
 */
function setMinDateDatepicker() {
  /** @type {Date} */
  let today = new Date();
  /** @type {string} */
  let tt = String(today.getDate()).padStart(2, '0');
  /** @type {string} */
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  /** @type {number} */
  let jjjj = today.getFullYear();
  /** @type {string} */
  let unformDate = jjjj + '-' + mm + '-' + tt;
  /** @type {HTMLInputElement} */
  document.getElementById('task-date-picker').min = unformDate;
  document.getElementById('task-date-picker').value = unformDate;
}

/**
 * Displays an alert message and redirects to 'board.html' after animation.
 */
function animateButton() {
  document.getElementById('alertMessage').style.display = 'flex';
  let alertMessage = document.getElementById('popup-message');
  setTimeout(() => {
    alertMessage.classList.add('translateNull');
    setTimeout(() => {
      alertMessage.classList.remove('translateNull');
      document.getElementById('alertMessage').style.display = 'none';
      window.location.href = 'board.html';
    }, 2000);
  }, 250);
}

/**
 * Displays an alert message for category-related actions.
 */
function animateAlertCategory() {
  document.getElementById('alert-message-category').style.display = 'flex';
  let alertMessage = document.getElementById('popup-message-category');
  setTimeout(() => {
    alertMessage.classList.add('translateNull');
    setTimeout(() => {
      alertMessage.classList.remove('translateNull');
      document.getElementById('alert-message-category').style.display = 'none';
    }, 1500);
  }, 250);
}

/**
 * Displays an alert message for contacts-related actions.
 */
function animateAlertContacts() {
  document.getElementById('alert-message-contacts').style.display = 'flex';
  let alertMessage = document.getElementById('popup-message-contacts');
  setTimeout(() => {
    alertMessage.classList.add('translateNull');
    setTimeout(() => {
      alertMessage.classList.remove('translateNull');
      document.getElementById('alert-message-contacts').style.display = 'none';
    }, 1500);
  }, 250);
}

/**
 * Displays an alert message for priority-related actions.
 */
function animateAlertPriority() {
  document.getElementById('alert-message-priority').style.display = 'flex';
  let alertMessage = document.getElementById('popup-message-priority');
  setTimeout(() => {
    alertMessage.classList.add('translateNull');
    setTimeout(() => {
      alertMessage.classList.remove('translateNull');
      document.getElementById('alert-message-priority').style.display = 'none';
    }, 1500);
  }, 250);
}

/**
 * Handles the form submission event for the task form.
 * @param {Event} event - The event triggered by the form submission.
 */
document.getElementById('task-task-form').addEventListener('submit', function (event) {
  event.preventDefault();
});

/**
 * Changes the color of the close icon to a specific color.
 */
function changeCleaningColor() {
  document.querySelector('#close_icon .cls-20').style.fill = '#00bee8';
}

/**
 * Resets the color of the close icon to its standard color.
 */
function changeCleaningColorToStandard() {
  document.querySelector('#close_icon .cls-20').style.fill = '#2a3647';
}

/**
 * Displays check and close icons / seperator and hides the plus icon.
 */
function showCheckAndCloseIcons() {
  /** @type {HTMLImageElement} */
  document.getElementById('icon-plus-image').style.display = 'none';
  /** @type {HTMLImageElement} */
  document.getElementById('icon-check-image').style.display = 'flex';
  /** @type {HTMLImageElement} */
  document.getElementById('seperator-container').style.display = 'flex';
  /** @type {HTMLImageElement} */
  document.getElementById('icon-close-image').style.display = 'flex';
}

/**
 * Displays the plus icon and hides check and close icons / seperator.
 */
function showPlusIcon() {
  /** @type {HTMLImageElement} */
  document.getElementById('icon-plus-image').style.display = 'flex';
  /** @type {HTMLImageElement} */
  document.getElementById('icon-check-image').style.display = 'none';
  /** @type {HTMLImageElement} */
  document.getElementById('seperator-container').style.display = 'none';
  /** @type {HTMLImageElement} */
  document.getElementById('icon-close-image').style.display = 'none';
}
