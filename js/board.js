/** 
 * The currently dragged element. 
 * @type {HTMLElement|undefined}
 */
let currentDraggedElement;

/**
 * Executes various initialization functions when the window loads.
 */
window.onload = function () {
  loadContactListPopup();
  loadContactList();
  loadTasksBoard();
  changeColor();
  resetButtons();
  loadLocalStorage();
  checkRegisteredUser();
  setMinDateDatepicker();
};

/**
 * Opens task details popup for a given task ID.
 * @param {string} taskId - The ID of the task to open details for.
 */
function openTaskDetails(taskId) {
  let taskDetails = document.getElementById('task');
  taskDetails.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  let task = allTasks.find((t) => t.taskId === taskId);

  if (task) {
    let assignedContacts = task['taskAssignment'] ? task['taskAssignment'].map((contact) => contact['name']).join(', ') : 'No contacts assigned';
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
      subtasksHTML = task['taskSubTask']
        .map((subtask, index) => {
          return /*html*/ `
            <div class="subtask">
              <input type="checkbox" id="subtask-${task['taskId']}-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtaskDoneInTask('${task['taskId']}', ${index})">
              <label for="subtask-${task['taskId']}-${index}">${subtask.name}</label>
            </div>`;
        })
        .join('');
    } else {
      subtasksHTML = 'No subtasks';
    }

    taskDetails.innerHTML = generateTaskDetailsHTML(task, categoryColor, formDate, assignedContacts, subtasksHTML);

    setTimeout(() => {
      document.getElementById('popup-task-container').classList.add('animate-popup-task-container');
    }, 200);
  }
}

/**
 * Loads contacts from the database into the popup.
 */
function loadContactListPopup() {
  let database = firebase.database();
  let contactEntries = database.ref('contacts');

  contactEntries.on('value', function (snapshot) {
    allContacts = [];
    snapshot.forEach(function (childSnapshot) {
      let contact = childSnapshot.val();
      allContacts.push(contact);
    });
  });
}

/**
 * Edits a task and displays its details in a popup.
 * @param {string} taskId - The ID of the task to edit.
 */
function editPopupTask(taskId) {
  let task = allTasks.find((t) => t.taskId === taskId);
  document.body.style.position = 'fixed';

  if (task) {
    let editTask = document.getElementById('task-popup-edit-container');

    editTask.scrollTop = 0;
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
    allContacts.forEach((contact, index) => {
      let isChecked = currentSelection.find((selectedContact) => selectedContact.email === contact.email);
      contactsList += /*html*/ `
          <div class="dropdown-item" id="dropdown-items-${index}-${contact['email']}">
            <div style="display: flex; align-items:center; justify-content: center; background: ${
              contact['color']
            }; font-size: 14px; color: white; height: 32px; width: 32px; border: 1px solid white; border-radius: 40px; cursor: pointer;" id="contact-badge-list">
              ${getInitials(contact['name'])}
            </div>
            <label for="${contact['email']}">${contact['name']}</label>
            <input style="cursor: pointer;" type="checkbox" id="${contact['email']}" value="${contact['email']}" onclick="toggleContactEditPopup(this, 'dropdown-items-${index}-${contact['email']}')" ${isChecked ? 'checked' : ''}>
          </div>
        `;
    });

    editTask.innerHTML = renderEditPopupHTML({
      taskId,
      currentTitle,
      currentDescription,
      currentDate,
      currentSubTask,
      currentCategory,
      currentCategoryColor,
      currentPriority,
      currentPriorityText,
      currentSelection,
      contactsList
    });

    let subTaskListContainer = document.getElementById('subtask-list-edit-popup');
    let subtaskCount = subTaskListContainer.children.length;
    document.getElementById('subtask-head-span').textContent = `This task has ${subtaskCount} subtasks`;

    selectedContactsEdit = currentSelection.slice();
    subtasksEdit = currentSubTask.slice();
    displaySubTasksEditPopup();
    loadContactListPopup();
    document.addEventListener('click', handleClickOutsideDropdowns);
  }
}

/**
 * Shows or hides the category dropdown menu for a specific task.
 * @param {string} taskId - The ID of the task for which the dropdown should be toggled.
 */
function showCategoryDropdown(taskId) {
  let dropdown = document.getElementById(`category-dropdown${taskId}`);
  let button = document.getElementById(`dropbtn-category-dropdown-button-${taskId}`);

  if (dropdown) {
    dropdown.classList.toggle('d-none');
    if (dropdown.classList.contains('d-none')) {
      button.classList.remove('icon-close');
      button.classList.add('icon-options');
    } else {
      button.classList.remove('icon-options');
      button.classList.add('icon-close');

      // Add click outside listener
      setTimeout(() => {
        document.addEventListener('click', handleClickOutsideDropdowns);
      }, 0);
    }
  }
}

/**
 * Moves a task to a new category and updates the database.
 * @param {string} taskId - The ID of the task to move.
 * @param {string} newCategory - The new category to assign to the task.
 */
function moveTask(taskId, newCategory) {
  let task = allTasks.find((t) => t['taskId'] === taskId);

  if (task) {
    task['taskBoardCategory'] = newCategory;
    let database = firebase.database();
    let taskRef = database.ref('tasks/' + taskId);
    taskRef.update({ taskBoardCategory: newCategory }).then(() => {
      updateTaskBoard();
    });
  }
}

/**
 * Shows the popup edit container.
 */
function showPopupEditContainer() {
  document.getElementById('task-edit-popup-parent-container').style.display = 'flex';
  document.getElementById('task-popup-edit-container').style.display = 'flex';
}

/**
 * Hides the popup edit container.
 */
function hidePopupEditContainer() {
  document.body.style.position = 'relative';
  document.getElementById('task-edit-popup-parent-container').style.display = 'none';
  document.getElementById('task-popup-edit-container').style.display = 'none';
  document.removeEventListener('click', handleClickOutsideDropdowns);
}

/**
 * Toggles the selection of a contact in the edit task popup.
 * @param {HTMLInputElement} checkbox - The checkbox element of the contact.
 */
function toggleContactEditPopup(checkbox, dropdownItem) {
  let contactEmail = checkbox.value;
  let contact = allContacts.find((contact) => contact.email === contactEmail);

  if (checkbox.checked) {
    selectedContactsEdit.push(contact);
    document.getElementById(dropdownItem).classList.add('selected');
    document.getElementById(dropdownItem).style.backgroundColor = '#091931';
    document.getElementById(dropdownItem).style.color = 'white';
  } else {
    selectedContactsEdit = selectedContactsEdit.filter((selectedContact) => selectedContact.email !== contactEmail);
    document.getElementById(dropdownItem).classList.remove('selected');
    document.getElementById(dropdownItem).style.backgroundColor = '#f1f1f1';
    document.getElementById(dropdownItem).style.color = '#091931';
  }
}

/**
 * Toggles the visibility of the category dropdown popup.
 * @param {Event} event - The click event triggering the toggle.
 */
function toggleCategoryDropdownPopup(event) {
  event.stopPropagation();
  let categoryDropdownEdit = document.getElementById('category-dropdown-popup-container');
  let dropdownArrow = document.getElementById('icon-category-dropdown-arrow-image-popup');

  categoryDropdownEdit.classList.toggle('d-none');
  dropdownArrow.src = categoryDropdownEdit.classList.contains('d-none') ? './assets/img/dropdown_down.svg' : './assets/img/dropdown_up.svg';
}

/**
 * Toggles the visibility of the priority dropdown popup.
 * @param {Event} event - The click event triggering the toggle.
 */
function togglePriorityDropdownPopup(event) {
  event.stopPropagation();
  let priorityDropdownEdit = document.getElementById('priority-dropdown-popup');
  let dropdownArrow = document.getElementById('icon-priority-dropdown-arrow-image-popup');

  priorityDropdownEdit.classList.toggle('d-none');
  dropdownArrow.src = priorityDropdownEdit.classList.contains('d-none') ? './assets/img/dropdown_down.svg' : './assets/img/dropdown_up.svg';
}

/**
 * Toggles the visibility of the contact dropdown popup.
 * @param {Event} event - The click event triggering the toggle.
 */
function toggleContactDropdownPopup(event) {
  let contactsDropdown = document.getElementById('contacts-list-popup-detail');
  let dropdownArrow = document.getElementById('icon-contacts-dropdown-arrow-image-popup');

  contactsDropdown.classList.toggle('d-none');
  dropdownArrow.src = contactsDropdown.classList.contains('d-none') ? './assets/img/dropdown_down.svg' : './assets/img/dropdown_up.svg';
}


function toggleContactDropdownAddTask(event) {
  event.stopPropagation();

  let contactsDropdown = document.getElementById('contacts-list');
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
    isDropdownOpen = false;
  }
  document.removeEventListener('click', handleClickOutsideDropdowns);
}

/**
 * Hides the task edit popup container and restores document body styling.
 */
function hidePopupEditContainer() {
  document.body.style.position = 'relative';
  document.getElementById('task-edit-popup-parent-container').style.display = 'none';
  document.getElementById('task-popup-edit-container').style.display = 'none';
  document.removeEventListener('click', handleClickOutsideDropdowns);
}

/**
 * Handles click events outside of dropdowns to close them.
 * @param {Event} event - The click event to check for clicks outside of dropdowns.
 */
function handleClickOutsideDropdowns(event) {
  let editContainer = document.getElementById('task-popup-edit-container');
  let taskCards = document.querySelectorAll('.task-board-container');
  let dropdownButtons = document.querySelectorAll('.icon-close, .icon-options');

  let clickedInsideTaskCard = Array.from(taskCards).some(card => card.contains(event.target));
  let clickedInsideDropdownButton = Array.from(dropdownButtons).some(button => button.contains(event.target));

  if (!editContainer.contains(event.target) && !clickedInsideTaskCard && !clickedInsideDropdownButton) {
    closeAllDropdowns();
  }
}

/**
 * Closes all currently open dropdowns and resets their state.
 */
function closeAllDropdowns() {
  let openDropdowns = document.querySelectorAll('.category-dropdown-board-edit:not(.d-none)');
  openDropdowns.forEach(dropdown => dropdown.classList.add('d-none'));

  let dropdownButtons = document.querySelectorAll('.icon-close');
  dropdownButtons.forEach(button => {
    button.classList.remove('icon-close');
    button.classList.add('icon-options');
  });

  document.removeEventListener('click', handleClickOutsideDropdowns);
}

document.addEventListener('click', function (event) {
  let categoryDropdown = document.getElementById('task-category-dropdown');
  let categoryDropdownArrow = document.getElementById('icon-dropdown-arrow-image');
  let contactsDropdown = document.getElementById('contacts-list');
  let contactsDropdownArrow = document.getElementById('icon-contacts-dropdown-arrow-image');

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
 * Adds a subtask to the edit task popup.
 */
function addSubTaskEditPopup() {
  let subTaskInputEdit = document.getElementById('edit-task-subtask-input-popup');
  let subTaskValueEdit = subTaskInputEdit.value.trim();

  if (subTaskValueEdit !== '') {
    let subTask = {
      name: subTaskValueEdit,
      done: false,
    };
    subtasksEdit.push(subTask);
    subTaskInputEdit.value = '';
    let subtasksCount = subtasksEdit.length;
    document.getElementById('subtask-head-span').textContent = `This task has ${subtasksCount} subtasks`;
    displaySubTasksEditPopup();
  }
}

/**
 * Displays the list of subtasks in the edit popup.
 * Clears the existing content and populates the list with subtasks from the subtasksEdit array.
 * Each subtask item includes a checkbox, name, and a delete button.
 */
function displaySubTasksEditPopup() {
  let subtaskListEdit = document.getElementById('subtask-list-edit-popup');
  subtaskListEdit.innerHTML = '';

  subtasksEdit.forEach((subtask, index) => {
    let subtaskItemEdit = document.createElement('li');
    subtaskItemEdit.innerHTML = /*html*/ `
      <input type="checkbox" id="subtask-edit-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtaskDoneEdit(${index})">
      <label for="subtask-edit-${index}">${subtask.name}</label>
      <button style="background: transparent; border: none; cursor: pointer;" type="button" onclick="removeSubTaskEditPopup(${index})"><img style="height: 12px; width: 12px;" src="assets/img/delete_icon.svg" alt=""></button>
    `;
    subtaskListEdit.appendChild(subtaskItemEdit);
  });
}

/**
 * Removes a subtask from the subtasksEdit array based on the given index and updates the display.
 * @param {number} index - The index of the subtask in the subtasksEdit array to be removed.
 */
function removeSubTaskEditPopup(index) {
  subtasksEdit.splice(index, 1);
  let subtasksEditCount = subtasksEdit.length;
  document.getElementById('subtask-head-span').textContent = `This task has ${subtasksEditCount} subtasks`;
  displaySubTasksEditPopup();
}

/**
 * Selects a category for a task in the popup and updates the UI accordingly.
 * Sets the selectedCategory variable, updates the category display text, hides the category dropdown,
 * and changes the dropdown arrow icon.
 * @param {Event} event - The event object that triggered the function.
 * @param {string} category - The category to be selected for the task.
 */
function selectCategoryPopup(event, category) {
  selectedCategory = category;
  document.getElementById('task-category-selection').innerText = selectedCategory;
  document.getElementById('task-category-dropdown').classList.add('d-none');
  document.getElementById('icon-dropdown-arrow-image').src = './assets/img/dropdown_down.svg';
}

/**
 * Selects a category in the edit task popup and updates the UI.
 * @param {string} category - The selected category.
 */
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

/**
 * Selects a priority in the edit task popup and updates the UI.
 * @param {string} priority - The selected priority.
 */
function selectPriorityEditPopup(priorityIcon, priorityText) {
  let dropdown = document.querySelector('#edit-task-priority-container-popup .dropdown-popup');
  dropdown.innerHTML = `${priorityText} <img src="${priorityIcon}" alt="Priority Icon"/>`;
}

/**
 * Saves the edited task.
 * @param {string} taskId - The ID of the task to save.
 */
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
    taskBoardCategory: boardCategory[0],
  };

  let database = firebase.database();
  let editedTask = database.ref('tasks').child(taskId);
  editedTask.update(task);

  document.getElementById('task-popup-edit-container').innerHTML = '';
  selectedContactsEdit = [];
  subtasksEdit = [];
}

/**
 * Toggles the completion status of a subtask in a task.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask in the task's subtask array.
 */
function toggleSubtaskDoneInTask(taskId, subtaskIndex) {
  let taskRef = database.ref('tasks/' + taskId + '/taskSubTask/' + subtaskIndex);
  taskRef.once('value', function (snapshot) {
    let subtask = snapshot.val();
    subtask.done = !subtask.done;
    taskRef.set(subtask);
  });
}

/**
 * Closes the task details popup by hiding it.
 */
function closePopup() {
  let taskDetails = document.getElementById('task');
  taskDetails.style.display = 'none';
  document.body.style.overflow = 'visible';
}

/**
 * Toggles the display of the main container popup board between flex and none.
 * If the container is currently hidden (d-none), it will be displayed (d-flex).
 * If the container is currently displayed (d-flex), it will be hidden (d-none).
 */
function closePopupBoard() {
  let taskDetails = document.getElementById('main-container-popup-board');
  document.body.style.overflow = 'visible';
  if (taskDetails.classList.contains('d-none')) {
    taskDetails.classList.remove('d-none');
    taskDetails.classList.add('d-flex');
  } else if (taskDetails.classList.contains('d-flex')) {
    taskDetails.classList.remove('d-flex');
    taskDetails.classList.add('d-none');
  }
}

/**
 * Prevents the propagation of the given event, stopping it from reaching parent elements.
 * @param {Event} event - The event object to prevent from propagating.
 */
function doNotClose(event) {
  const isInsideModal = event.target.closest('#main-container-popup-board') ||
                        event.target.closest('#task') ||
                        event.target.closest('#task-edit-popup-parent-container');
  const isInsideDropdown = event.target.closest('#edit-priority-container-popup') ||
                           event.target.closest('#contacts-list-popup-detail') ||
                           event.target.closest('#priority-dropdown-popup'); 
  if (isInsideModal && !isInsideDropdown) {
    event.stopPropagation();
  }
}

function handleDropdownClosing(event) {
  const editWrapper = event.target.closest('.edit-popup-HTML-wrapper');
  const formWrapper = event.target.closest('.form-wrapper');

  if (editWrapper) {
    closeDropdownsInContainer(editWrapper);
  } else if (formWrapper) {
    closeDropdownsInContainer(formWrapper);
  }
}

function closeDropdownsInContainer(container) {
  const openDropdowns = container.querySelectorAll('.dropdown:not(.d-none)');
  openDropdowns.forEach(dropdown => dropdown.classList.add('d-none'));

  const dropdownArrows = container.querySelectorAll('.dropdown-arrow');
  dropdownArrows.forEach(arrow => {
    arrow.src = './assets/img/dropdown_down.svg';
  });
}

document.addEventListener('click', handleDropdownClosing);

/**
 * Loads tasks from the database into the task board.
 */
function loadTasksBoard() {
  let tasks = database.ref('tasks');

  tasks.on('value', function (snapshot) {
    allTasks = [];

    snapshot.forEach(function (childSnapshot) {
      let task = childSnapshot.val();
      task.taskId = childSnapshot.key;
      allTasks.push(task);
    });

    updateTaskBoard();
  });
}

/**
 * Updates the task board UI based on the current state of allTasks array.
 * This function generates HTML for each task and updates the respective category containers on the board.
 * It checks the length of the tasks arrays filtered by category and displays an empty container if there are none in a category.
 */
function updateTaskBoard() {
  boardCategory.forEach((category) => {
    let tasks = allTasks.filter((task) => task['taskBoardCategory'] === category);

    let categoryContainer = document.getElementById(category);
    let taskCounter = categoryContainer.closest('section').querySelector('.task-counter');

    taskCounter.innerHTML = `${tasks.length}`;

    categoryContainer.innerHTML = '';

    let columnHeader = categoryContainer.getAttribute('data-header');

    if (tasks.length === 0) {
      categoryContainer.innerHTML = `<div class="empty">No tasks in ${columnHeader}</div>`;
    } else {
      tasks.forEach((task) => {
        categoryContainer.innerHTML += generateTaskHTML(task);
      });
    }
  });
}

/**
 * Sets the current dragged element ID and adds a CSS class to indicate dragging.
 * If the element with the specified ID is not found, an error message is logged.
 * @param {string} id - The ID of the element being dragged.
 */
function startDragging(id) {
  currentDraggedElement = id;
  const element = document.getElementById(id);
  if (element) {
    element.classList.add('container-rotate');
  } else {
    console.error('Element with id ' + id + ' not found');
  }
}

/**
 * Generates HTML markup for a task based on its details.
 * @param {Object} task - The task object containing details like title, description, etc.
 * @returns {string} HTML markup representing the task.
 */
function generateTaskHTML(task) {
  let contactNames = task['taskAssignment'] ? task['taskAssignment'].map((contact) => contact['name']) : [];
  let initials;
  if (contactNames.length > 1) {
    initials = getInitialsList(contactNames);
  } else if (contactNames.length === 1) {
    initials = [getInitials(contactNames[0])];
  }

  let categoryColor = task['taskCategoryColor'];
  if (task['taskCategory'] === 'User Story') {
    categoryColor = '#0038ff';
  } else if (task['taskCategory'] === 'Technical Task') {
    categoryColor = '#1fd7c1';
  }

  let assignedContactsHTML = task['taskAssignment']
    .map((contact, index) => {
      return /*html*/ `<div class="task-contact-initials" style="background: ${contact['color']};">${initials[index]}</div>`;
    })
    .join('');

  let completedSubtasks = task['taskSubTask'] ? task['taskSubTask'].filter((subtask) => subtask.done).length : 0;
  let totalSubtasks = task['taskSubTask'] ? task['taskSubTask'].length : 0;
  let progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  let taskId = `${task['taskId']}`;

  let progressHTML = '';
  if (totalSubtasks > 0) {
    progressHTML = renderProgressHTML(progress, completedSubtasks, totalSubtasks);
  }

  return renderTaskHTML({
    taskId,
    taskTitle: task['taskTitle'],
    taskDescription: task['taskDescription'],
    categoryColor,
    taskCategory: task['taskCategory'],
    assignedContactsHTML,
    progressHTML,
    taskPriority: task['taskPriority'],
  });
}


function renderProgressHTML(progress, completedSubtasks, totalSubtasks) {
  return /*html*/ `<div class="task-item-output" id="task-progress-container">
  <progress style="max-width: 150px;" value="${progress}" max="100"></progress>
  <span>${completedSubtasks}/${totalSubtasks} Subtasks</span>
</div>`;
}

function initializeEventListeners() {
  document.addEventListener('dragstart', function (e) {
    if (e.target.closest('.task-assignment-container')) {
      preventDragStart(e);
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.task-assignment-container')) {
      preventClick(e);
    }
  });
}

/**
 * Initializes event listeners for preventing default actions on task assignment elements.
 */
document.addEventListener('DOMContentLoaded', initializeEventListeners);

/**
 * Prevents the default click behavior.
 * @param {MouseEvent} e - The click event.
 */
function preventClick(e) {
  e.stopPropagation();
}

/**
 * Prevents the default drag start behavior.
 * @param {DragEvent} e - The drag event.
 */
function preventDragStart(e) {
  e.stopPropagation();
  e.preventDefault();
}

/**
 * Prevents the default behavior of an event, allowing a drop operation to occur.
 * @param {Event} ev - The event object for which the default behavior needs to be prevented.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves the task currently being dragged to a specified category.
 * Updates the task's board category in the database and refreshes the task board UI.
 * @param {string} category - The category to move the task into.
 */
function moveTo(category) {
  let task = allTasks.find((t) => t['taskId'] === currentDraggedElement);

  task['taskBoardCategory'] = category;
  database
    .ref('tasks/' + task['taskId'])
    .update(task)
    .then(() => {
      updateTaskBoard();
    });
}

/**
 * Highlights a category on the task board temporarily to indicate a potential drop target.
 * @param {string} category - The category ID to highlight.
 */
function highlight(category) {
  document.getElementById(category).classList.add('drag-area-highlight');
  setTimeout(() => {
    document.getElementById(category).classList.remove('drag-area-highlight');
  }, 1500);
}

/**
 * Removes the highlight from a category after a delay.
 * @param {string} category - The category ID to remove highlight from.
 */
function removeHighlight(category) {
  setTimeout(() => {
    document.getElementById(category).classList.remove('drag-area-highlight');
  }, 1000);
}

/**
 * Filters tasks on the task board based on a search input value.
 * Hides tasks that do not match the filter criteria.
 */
function filterTask() {
  let filterValue = document.getElementById('filter-task-input').value.toUpperCase();
  let tasks = document.querySelectorAll('.task-board-container');

  tasks.forEach((task) => {
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

/**
 * Shows the add task popup board by setting its display to flex and animating the popup form.
 */
function showAddTaskPopupBoard() {
  document.getElementById('main-container-popup-board').classList.remove('d-none');
  document.getElementById('main-container-popup-board').classList.add('d-flex');
  document.body.style.overflow = 'hidden';
  changeColor('priority-medium-text');
}

/**
 * Hides the add task popup board by setting its display to none after removing the flex display class.
 */
function hideAddTaskPopupBoard() {
  document.getElementById('main-container-popup-board').classList.remove('d-flex');
  document.getElementById('main-container-popup-board').classList.add('d-none');
  document.body.style.overflow = 'visible';
}

/**
 * Shows the add task popup board by setting its display to flex and animating the popup form.
 */
function showEditTaskPopupBoard() {
  document.body.style.overflow = 'hidden';

  document.getElementById('main-container-popup-board').classList.remove('d-none');
  document.getElementById('main-container-popup-board').classList.add('d-flex');
}

/**
 * Hides the add task popup board by setting its display to none after removing the flex display class.
 */
function hideEditTaskPopupBoard() {
  document.body.style.overflow = 'visible';
  document.getElementById('main-container-popup-board').classList.remove('d-flex');
  document.getElementById('main-container-popup-board').classList.add('d-none');
}

/**
 * Sets the minimum date for the date picker to today.
 */
function setMinDateDatepickerEditPopup() {
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
  document.getElementById('edit-task-date-container-popup').min = unformDate;
  document.getElementById('edit-task-date-container-popup').value = unformDate;
}
