let selectedCategory = '';
let selectedContacts = [];
let allContacts = [];
let subtasks = [];


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


function editTask(taskId) {
  let database = firebase.database();
  let taskRef = database.ref('tasks/' + taskId);

  taskRef.once('value', function(snapshot) {
    let task = snapshot.val();
    document.getElementById('task-trial-title').value = task.taskTitle;
    document.getElementById('task-trial-description').value = task.taskDescription;
    document.getElementById('task-trial-date-picker').value = task.taskDate;
    document.getElementById('task-trial-subtask-input').value = task.taskSubTask;
    selectedCategory = task.taskCategory;
    document.getElementById('task-trial-category-selection').innerText = selectedCategory;
    
    selectedContacts = task.taskAssignment || [];
    updateSelectedContactsDisplay();

    taskRef.remove();
  });
}


function saveTask() {
  let title = document.getElementById('task-trial-title').value;
  let description = document.getElementById('task-trial-description').value;
  let dueDate = document.getElementById('task-trial-date-picker').value;
  let subTask = document.getElementById('task-trial-subtask-input').value;

  let task = {
    'taskCategory': selectedCategory,
    'taskTitle': title,
    'taskDescription': description,
    'taskDate': dueDate,
    'taskPriority': priority,
    'taskAssignment': selectedContacts,
    'taskSubTask': subtasks
  };

  clearInputsAndArrays();

  let database = firebase.database();
  let newTask = database.ref('tasks').push();
  newTask.set(task);
  selectedCategory = '';
  document.getElementById('task-trial-category-selection').innerText = "Category";
  priority = '';
  dueDate = date.datepicker( "option" , {setDate: null, minDate: null, maxDate: null} ); 
}


function clearInputsAndArrays() {
  document.getElementById('task-trial-title').value = "";
  document.getElementById('task-trial-description').value = "";
  document.getElementById('task-trial-subtask-input').value = "";
  selectedContacts = [];
  updateSelectedContactsDisplay();
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
      let subtaskItem = document.createElement('div');
      subtaskItem.innerHTML = `${subtask} <button type="button" onclick="removeSubTask(${index})">X</button>`;
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

  tasks.on('value', function (snapshot) {
    let taskContainer = document.getElementById('task-trial-container');
    taskContainer.innerHTML = "";

    snapshot.forEach(function (childSnapshot) {
      let task = childSnapshot.val();
      let assignedContacts = task.taskAssignment ? task.taskAssignment.map(contact => contact.name).join(', ') : 'No contacts assigned';

      taskContainer.innerHTML += /*html*/ `
            <div id="task-trial-board-container">
                <div id="task-trial-category-container">${task.taskCategory}</div>
                <div id="task-trial-title-container">${task.taskTitle}</div>
                <div id="task-trial-description-container">${task.taskDescription}</div>
                <div id="task-trial-date-container">Due date: ${task.taskDate}</div>
                <div id="task-trial-priority-container"><img src="${task.taskPriority}" id="task-trial-priority-icon-task" alt="Priority Icon"/></div>
                <div id="task-trial-assignment-container">Assigned to: ${assignedContacts}</div>
                <div id="task-trial-subtask-container">Subtasks: ${task.taskSubTask}</div>
                <div id="task-trial-button-container">
                    <div id="task-trial-delete-button"><img style="height: 16px;" src="assets/img/pen_DARK.svg" alt="" /><button onclick="deleteTask('${childSnapshot.key}')">Delete</button></div>
                    <div id="task-trial-edit-button"><img style="height: 16px;" src="assets/img/delete_icon.svg" alt="" /><button onclick="editTask('${childSnapshot.key}')">Edit</button></div>
                </div>
            </div>`;
    });
  });
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

          contactsList.innerHTML += `
              <div class="dropdown-item">
                  <input type="checkbox" id="${contact.email}" value="${contact.email}" onclick="toggleContactAssignment(this)">
                  <label for="${contact.email}">${contact.name}</label>
              </div>`;
      });
  });
}


function toggleContactAssignment(checkbox) {
  let contactEmail = checkbox.value;
  if (checkbox.checked) {
    let contact = allContacts.find(contact => contact.email === contactEmail);
    selectedContacts.push(contact);
  } else {
    selectedContacts = selectedContacts.filter(contact => contact.email !== contactEmail);
  }
  updateSelectedContactsDisplay();
}


function updateSelectedContactsDisplay() {
  let selectedContactsDiv = document.getElementById('selected-contacts');
  selectedContactsDiv.innerText = "Selected Contacts: " + selectedContacts.map(contact => contact.name).join(', ');
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


// window.onload = function() {

  
// }


function createCategoryIconUrgent() {
  priority = '/assets/img/urgent_icon.svg';
}


function createCategoryIconMedium() {
  priority = '/assets/img/medium_icon.svg';
}


function createCategoryIconLow() {
  priority = '/assets/img/low_icon.svg';
}


function setMinDateDatepicker() {
  let today = new Date();
  let tt = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let jjjj = today.getFullYear();

  today = jjjj + '-' + mm + '-' + tt;
  document.getElementById('task-trial-date-picker').min = today;
  document.getElementById('task-trial-date-picker').value = today;
}

// set actual date-function
//         function getDate() {
//   var today = new Date();
//   var dd = today.getDate();
//   var mm = today.getMonth()+1; //January is 0!
//   var yyyy = today.getFullYear();

//   if(dd<10) {
//       dd = '0'+dd
//   }

//   if(mm<10) {
//       mm = '0'+mm
//   }

//   today = yyyy + '/' + mm + '/' + dd;
//   console.log(today);
//   document.getElementById("date").value = today;
// }

// window.onload = function() {
//   getDate();
// };
