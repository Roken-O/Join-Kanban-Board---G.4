function loadTasks() {
  let tasks = database.ref('tasks');

  tasks.on('value', function(snapshot) {
    let taskContainer = document.getElementById('task-container');
    taskContainer.innerHTML = "";
    allTasks = [];

    snapshot.forEach(function(childSnapshot) {
      let task = childSnapshot.val();
      task.taskId = childSnapshot.key;
      allTasks.push(task);

      let assignedContacts = task['taskAssignment'] ? task['taskAssignment'].map(contact => contact['name']).join(', ') : 'No contacts assigned';
      let dateParts = task['taskDate'].split('-');
      let formDate = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0];
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

      taskContainer.innerHTML += /*html*/`
        <div id="task-board-container" draggable="true">
          <div class="task-item-output" id="task-category-container" style="background: ${task['taskCategoryColor']}">${task['taskCategory']}</div>
          <div class="task-item-output" id="task-title-container">${task['taskTitle']}</div>
          <div class="task-item-output" id="task-description-container">${task['taskDescription']}</div>
          <div class="task-item-output" id="formatted-date-display">Due date: ${formDate}</div>
          <div class="task-item-output" id="task-priority-container"><img src="${task['taskPriority']}" id="task-priority-icon-task" alt="Priority Icon"/></div>
          <div class="task-item-output" id="task-assignment-container">Assigned to: ${assignedContacts}</div>
          <div class="task-item-output" id="task-subtask-container">${subtasksHTML}</div>
          <div id="task-button-container">
            <div style="display: flex; align-items: center; cursor: pointer;" id="task-delete-button"><img style="height: 12px; width: 12px; cursor: pointer;" src="/assets/img/delete_icon.svg" alt="" /><button style="background: transparent; border: none; cursor: pointer;" onclick="deleteTask('${task['taskId']}')">Delete</button></div>
            <div style="display: flex; align-items: center; cursor: pointer;" id="task-edit-button"><img style="height: 12px; width: 12px; cursor: pointer;" src="/assets/img/edit_icon.svg" alt="" /><button style="background: transparent; border: none; cursor: pointer;" onclick="editTask('${task['taskId']}')">Edit</button></div>
          </div>
        </div>`;
    });
  });
}


function toggleSubtaskDone(index) {
  subtasks[index].done = !subtasks[index].done;
  displaySubTasks();
}


function toggleSubtaskDoneEdit(index) {
  subtasksEdit[index].done = !subtasksEdit[index].done;
  displaySubTasksEdit();
}