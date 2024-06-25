function loadTasks() {
    
    let tasks = database.ref('tasks');
  
      tasks.on('value', function(snapshot) {
      let taskContainer = document.getElementById('task-trial-container');
      taskContainer.innerHTML = "";
      allTasks = [];
      
      snapshot.forEach(function(childSnapshot) {
        let task = childSnapshot.val();
        task.taskId = childSnapshot.key;  
        allTasks.push(task);
  
        let assignedContacts = task['taskAssignment'] ? task['taskAssignment'].map(contact => contact['name']).join(', ') : 'No contacts assigned';
        let dateParts = task['taskDate'].split('-');
        let formDate = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0];
        let subtasks = task['taskSubTask'] ? task['taskSubTask'].join(', ') : 'No subtasks';
  
        taskContainer.innerHTML += /*html*/ `
              <div id="task-trial-board-container" draggable="true">
                  <div class="task-item-output" id="task-trial-category-container">${task['taskCategory']}</div>
                  <div class="task-item-output" id="task-trial-title-container">${task['taskTitle']}</div>
                  <div class="task-item-output" id="task-trial-description-container">${task['taskDescription']}</div>
                  <div class="task-item-output" id="formatted-date-display">Due date: ${formDate}</div>
                  <div class="task-item-output" id="task-trial-priority-container"><img src="${task['taskPriority']}" id="task-trial-priority-icon-task" alt="Priority Icon"/></div>
                  <div class="task-item-output" id="task-trial-assignment-container">Assigned to: ${assignedContacts}</div>
                  <div class="task-item-output" id="task-trial-subtask-container">Subtasks: ${subtasks}</div>
                  <div id="task-trial-button-container">
                      <div style="display: flex; align-items: center; cursor: pointer;" id="task-trial-delete-button"><img style="height: 12px; width: 12px; cursor: pointer;" src="/assets/img/delete_icon.svg" alt="" /><button style="background: transparent; border: none; cursor: pointer;" onclick="deleteTask('${task['taskId']}')">Delete</button></div>
                      <div style="display: flex; align-items: center; cursor: pointer;" id="task-trial-edit-button"><img style="height: 12px; width: 12px; cursor: pointer;" src="/assets/img/pen_DARK.svg" alt="" /><button style="background: transparent; border: none; cursor: pointer;" onclick="editTask('${task['taskId']}')">Edit</button></div>
                  </div>
              </div>`;
      });
    });
  }