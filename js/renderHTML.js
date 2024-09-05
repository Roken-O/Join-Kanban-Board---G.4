function getSignupSite() {
  return `
     <form onsubmit="signup(); return false;">
        <div class="arrow-left-container">
          <div onclick="goToLoginSite()" class="back-icon"> <img src="./assets/img/back_icon.svg"> </div>
          <div class="h1-container">
            <h1>Sign up</h1>
            <div class="line"></div>
          </div>
        </div>

        <div class="inputs-container flex-col-just-center">
            <input id="username" type="text" required placeholder="Name" class="input0">
            <input oninput="checkEmailSignupFunk()" id="email-signup" type="email" required placeholder="Email" class="input1">
             <div id="existing-email" class="wrong-password-container d-none">This email address already exists!</div>
            <input oninput="checkPassword()" type="password" id="password-signup" type="text" required placeholder="Password" class="input2">
            <input oninput="checkPassword()" type="password" id="confirmPassword-signup" type="text" required placeholder="Confirm Password" class="input2">
            <div id="wrong-password" class="wrong-password-container d-none">Ups! your password doesn't match</div>
            <div class="checkbox-signup-site">
                <input oninvalid="this.setCustomValidity('You must accept the Privacy Policy')" oninput="this.setCustomValidity('')" type="checkbox" required>
                <span>I accept <a onclick="goToPrivacyOrImprintOrHelp()" href="#">Privacy Policy</a></span>
            </div>
        </div>
        <div class="login-buttons-container">
            <button id="signup-button">signup</button>
        </div>
    </form>`;
}

//  Render functions Contacts

function renderContactHTML(contact, i) {
  return `
        <div
          id="contact-border${i}"
          onclick="showContactInfo('${contact.email}');showContactResponsive('${contact.email}',${i});closePopUpEditDelete();changeBackground(${i});"
          class="flex-align-center contact-entry contact-border"
        >
        <div class="initial-name-email-container">
          <div style="background: ${contact.color}" class="first-letters-name-contactlist-bg">
            <span class="first-letters-name-contactlist">${getInitials(contact.name)}</span>
          </div>
          <div class="contact-name-email-contactlist">
            <span class="contact-name-contactlist">${contact.name}</span>
            <span class="email-contactlist">${contact.email}</span>
          </div>
        </div>
        </div>
      `;
}

function renderLine(initial) {
  return `
          <div>
            <div class="initial-letter">${initial}</div>
            <div class="breakline-contactlist" id="contacts-without-breakline">
        `;
}

function renderContactResponisveHTML(j, currentColor, currentName, currentEmail, currentPhone) {
  return `
  <div class="flex-align-center contact-pic-name-container-mobil">
          <div style="background-color: ${currentColor}"  class="first-letters-name-bg-mobil">
            <span class="first-letters-name-mobil">${getInitials(currentName)}</span>
          </div>
          <div id="contact-name">
            <h2>${currentName}</h2>
            <div class="flex-align-center" id="contact-edit-delete">
              <div
                onclick="editContactPopUp();editContact('${currentEmail}')"
                class="flex-align-center"
                id="contact-edit"
              >
                <img
                  class="contact-pen-delete-img"
                  src="./assets/img/pen_DARK.svg"
                  alt=""
                />
                <span>Edit</span>
              </div>
              <div class="flex-align-center" id="contact-delete">
                <img
                  class="contact-pen-delete-img"
                  src="./assets/img/delete_icon.svg"
                  alt=""
                />
                <span> Delete</span>
              </div>
            </div>
          </div>
        </div>
        <span id="span-contact-information">Contact Information</span>
        <div class="flex-col-just-center" id="email-telefon-contact">
          <div class="flex-col-just-center" id="email-contact">
            <span>Email</span>
            <a href="">${currentEmail}</a>
          </div>
          <div class="flex-col-just-center" id="phone-contact">
            <span>Phone</span>
            <a href="">${currentPhone}</a>
          </div>
        </div>
        <img
          onclick="openPopUpEditDelete()"
          class="button-more-options"
          src="./assets/img/button_more_options_dark_blue.svg"
          alt=""
        />
        <div
          onclick="closePopUpEditDelete()"
          id="PopUp-edit-delete-bg"
          class="PopUp-edit-delete-bg"
        >
          <div id="PopUp-edit-delete" class="PopUp-edit-delete">
            <div onclick="editContactPopUp();editContact('${currentEmail}')" class="PopUp-edit-pen">
              <img
                class="PopUp-edit-pen-img"
                src="./assets/img/pen_DARK.svg"
                alt=""
              />
              <span>Edit</span>
            </div>
            <div onclick="deleteContact('${currentEmail}');closeContact(${j});"  class="PopUp-delete">
              <img
                class="PopUp-delete-img"
                src="./assets/img/delete_icon.svg"
                alt=""
              />
              <span>Delete</span>
            </div>
          </div>
        </div>
      `;
}

function renderShowContactInfo(currentColor, currentName, currentEmail, currentPhone) {
  return `
  <div class="flex-align-center contact-pic-name-container">
        <div style="background-color: ${currentColor}"  class="first-letters-name-bg">
          <span class="first-letters-name">${getInitials(currentName)}</span>
        </div>
        <div id="contact-name">
          <h2>${currentName}</h2>
          <div class="flex-align-center" id="contact-edit-delete">
            <div
              onclick="editContactPopUp();editContact('${currentEmail}')"
              class="flex-align-center"
              id="contact-edit"
            >
              <img
                class="contact-pen-delete-img"
                src="./assets/img/pen_DARK.svg"
                alt=""
              />
              <span>Edit</span>
            </div>
            <div onclick="deleteContact('${currentEmail}')" class="flex-align-center" id="contact-delete">
              <img
                class="contact-pen-delete-img"
                src="./assets/img/delete_icon.svg"
                alt=""
              />
              <span> Delete</span>
            </div>
          </div>
        </div>
      </div>
      <span id="span-contact-information">Contact Information</span>
      <div class="flex-col-just-center" id="email-telefon-contact">
        <div class="flex-col-just-center" id="email-contact">
          <span>Email</span>
          <a href="">${currentEmail}</a>
        </div>
        <div class="flex-col-just-center" id="phone-contact">
          <span>Phone</span>
          <a href="">${currentPhone}</a>
        </div>
      </div>
      `;
}

function renderPopupEditAddMiddleHTML(currentColor, currentName) {
  return `
  <div  style="background-color: ${currentColor}" id="first-letters-name-bg" class="first-letters-name-bg margin-top-60px">
            <span class="first-letters-name">${getInitials(currentName)}</span>
          </div>
  `;
}

function renderFormEditContactHTML(currentEmail) {
  return `
  <form onsubmit="saveEditedContact('${currentEmail}');return false;" class="form-add-new-contact" id="form-edit-contact" action="">
  <input
    placeholder="Name"
    class="input-text-email-number-contact input-text-contact"
    id="input-edit-name-contact"
    type="text"
    required
  />
  <input
    placeholder="Email"
    class="input-text-email-number-contact input-email-contact"
    id="input-edit-email-contact"
    type="email"
    required
  />
  <input
    placeholder="Phone"
    class="input-text-email-number-contact input-number-contact"
    id="input-edit-phone-contact"
    type="text"
    required
  />
  <div class="button-container-edit">
    <img
      onclick="deleteContact('${currentEmail}'); closePupUpaddNewOrEdditContact();closeContact()"
      class="button_delete"
      src="./assets/img/button_delete.svg"
      alt=""
    />
    <button type="submit" style="background: transparent; border: none;">
      <img
        onclick="validateAndClosePopup()"
        class="button_save_contact"
        src="./assets/img/button_save.svg"
        alt=""
      />
    </button>
  </div>
</form>
    `;
}

function renderLogout(registeredID) {
  return `
   <div class="popout-showlogout">
      <a href="imprint.html">Legal Notice</a>
      <a href="privacy.html">Privacy Policy</a>
      <a onclick="logout('${registeredID}')" href="#">Log Out</a>
    </div>`;
}

function generateEditPopupHTML({ taskId, currentTitle, currentDescription, currentDate, currentSubTask, currentCategory, currentCategoryColor, currentPriority, currentPriorityText, currentSelection, allContacts }) {
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
      <input type="checkbox" id="${contact['email']}" value="${contact['email']}" onclick="toggleContactEditPopup(this, 'dropdown-items-${index}-${contact['email']}')" ${isChecked ? 'checked' : ''}>
    </div>
  `;
  });

  let subTaskListItems = currentSubTask.map((subtask) => /*html*/ `<li>${subtask}</li>`).join('');

  return /*html*/ `
    <h2 style="font-size: 32px;">Edit Task</h2>
    <div id="popup-seperator"></div>
    <input type="text" id="edit-task-title-container-popup" value="${currentTitle}">
    <input type="text" id="edit-task-description-container-popup" value="${currentDescription}">
    <input type="date" id="edit-task-date-container-popup" value="${currentDate}">
    <input type="text" id="edit-task-subtask-input-popup" placeholder="Subtask">
    <section id="subtask-head">
      <span id="subtask-head-span"></span>
      <button id="add-subtask-popup-button" type="button" onclick="addSubTaskEditPopup()">Add Subtask</button>
      <ul id="subtask-list-edit-popup">${subTaskListItems}</ul>
    </section>
    <section id="edit-task-category-container-popup" onclick="doNotClose(event)">
      <div id="edit-category-dropdown-container-popup" onclick="toggleCategoryDropdownPopup(event)">  
        <div class="dropdown-popup" id="category-dropdown-popup" style="background: ${currentCategoryColor}; color: white;">${currentCategory}</div>
        <div>
          <img id="icon-category-dropdown-arrow-image-popup" src="./assets/img/dropdown_down.svg" alt="Dropdown Arrow Icon"/>
        </div>
      </div>
      <div id="category-dropdown-popup-container" class="category-dropdown-popup-container d-none">
        <div class="dropdown-item-category" style="cursor: pointer;" onclick="selectCategoryEditPopup('Technical Task')">Technical Task</div>
        <div class="dropdown-item-category" style="cursor: pointer;" onclick="selectCategoryEditPopup('User Story')">User Story</div>
      </div>
    </section>
    <section id="edit-task-priority-container-popup">
      <div id="edit-priority-container-popup" onclick="togglePriorityDropdownPopup(event)">        
        <div class="dropdown-popup">${currentPriorityText} <img src="${currentPriority}" alt="Priority Icon"/></div>
        <div>
          <img id="icon-priority-dropdown-arrow-image-popup" src="./assets/img/dropdown_down.svg" alt="Dropdown Arrow Icon"/>
        </div>
      </div>
      <div id="priority-dropdown-popup" class="priority-dropdown-popup d-none">
        <div class="dropdown-item-priority" style="cursor: pointer;" onclick="selectPriorityEditPopup('./assets/img/urgent_icon.svg', 'Urgent')">Urgent</div>
        <div class="dropdown-item-priority" style="cursor: pointer;" onclick="selectPriorityEditPopup('./assets/img/medium_icon.svg', 'Medium')">Medium</div>
        <div class="dropdown-item-priority" style="cursor: pointer;" onclick="selectPriorityEditPopup('./assets/img/low_icon.svg', 'Low')">Low</div>
      </div>
    </section>
    <section id="edit-task-assignment-container-popup">
      <div id="contact-list-selection-popup" onclick="toggleContactDropdownPopup(event)">
        <span>Assign Contacts</span>
        <div class="icon-dropdown-arrow">
          <img id="icon-contacts-dropdown-arrow-image-popup" src="./assets/img/dropdown_down.svg" alt="Dropdown Arrow Icon"/>
        </div>
      </div>  
      <div id="contacts-list-popup-detail" class="dropdown-list-board d-none">
        ${contactsList}
      </div>
    </section>
    <section id="task-popup-edit-button-container">
      <button id="save-popup-button" onclick="saveEditedPopupTask('${taskId}'); openTaskDetails('${taskId}'); hidePopupEditContainer()">Save</button>
      <button id="cancel-save-popup-button" onclick="openTaskDetails('${taskId}'); hidePopupEditContainer()">Cancel</button>
    </section>
  `;
}

function generateTaskDetailsHTML(task, categoryColor, formDate, assignedContacts, subtasksHTML) {
  return /*html*/ `
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
          <img src="./assets/img/delete_icon.png">
          <span onclick="deleteTask('${task['taskId']}'); closePopup()"> Delete </span>
        </div>
        <div class="popup-del-edit">
          <img src="./assets/img/pen_DARK.png">
          <span onclick="editPopupTask('${task['taskId']}'); showPopupEditContainer(); closePopup();"> Edit </span>
        </div>
      </div>
    </div>
  `;
}

function renderEditPopupHTML({ taskId, currentTitle, currentDescription, currentDate, currentSubTask, currentCategory, currentCategoryColor, currentPriority, currentPriorityText, currentSelection, contactsList }) {
  let subTaskListItems = currentSubTask.map((subtask) => /*html*/ `<li>${subtask}</li>`).join('');

  return /*html*/ `
  <section class="edit-popup-HTML-wrapper">
    <h2 style="font-size: 32px;">Edit Task</h2>
    <div id="popup-seperator"></div>
    <input type="text" id="edit-task-title-container-popup" value="${currentTitle}">
    <input type="text" id="edit-task-description-container-popup" value="${currentDescription}">
    <input type="date" id="edit-task-date-container-popup" value="${currentDate}">
    <input type="text" id="edit-task-subtask-input-popup" placeholder="Subtask">
    <section id="subtask-head">
      <span id="subtask-head-span"></span>
      <button id="add-subtask-popup-button" type="button" onclick="addSubTaskEditPopup()">Add Subtask</button>
      <ul id="subtask-list-edit-popup">${subTaskListItems}</ul>
    </section>
    <section id="edit-task-category-container-popup">
      <div id="edit-category-dropdown-container-popup" onclick="toggleCategoryDropdownPopup(event)">  
        <div class="dropdown-popup" id="category-dropdown-popup" style="background: ${currentCategoryColor}; color: white;">${currentCategory}</div>
        <div>
          <img id="icon-category-dropdown-arrow-image-popup" src="./assets/img/dropdown_down.svg" alt="Dropdown Arrow Icon"/>
        </div>
      </div>
      <div id="category-dropdown-popup-container" class="category-dropdown-popup-container d-none">
        <div class="dropdown-item-category" style="cursor: pointer;" onclick="selectCategoryEditPopup('Technical Task')">Technical Task</div>
        <div class="dropdown-item-category" style="cursor: pointer;" onclick="selectCategoryEditPopup('User Story')">User Story</div>
      </div>
    </section>
    <section id="edit-task-priority-container-popup">
      <div id="edit-priority-container-popup" onclick="togglePriorityDropdownPopup(event)">        
        <div class="dropdown-popup">${currentPriorityText} <img src="${currentPriority}" alt="Priority Icon"/></div>
        <div>
          <img id="icon-priority-dropdown-arrow-image-popup" src="./assets/img/dropdown_down.svg" alt="Dropdown Arrow Icon"/>
        </div>
      </div>
      <div id="priority-dropdown-popup" class="priority-dropdown-popup d-none">
        <div class="dropdown-item-priority" style="cursor: pointer;" onclick="selectPriorityEditPopup('./assets/img/urgent_icon.svg', 'Urgent')">Urgent</div>
        <div class="dropdown-item-priority" style="cursor: pointer;" onclick="selectPriorityEditPopup('./assets/img/medium_icon.svg', 'Medium')">Medium</div>
        <div class="dropdown-item-priority" style="cursor: pointer;" onclick="selectPriorityEditPopup('./assets/img/low_icon.svg', 'Low')">Low</div>
      </div>
    </section>
    <section id="edit-task-assignment-container-popup">
        <div id="contact-list-selection-popup" onclick="toggleContactDropdownPopup(event)">
          <span>Assign Contacts</span>
          <div class="icon-dropdown-arrow">
              <img id="icon-contacts-dropdown-arrow-image-popup" src="./assets/img/dropdown_down.svg" alt="Dropdown Arrow Icon"/>
          </div>
        </div>  
        <div id="contacts-list-popup-detail" class="dropdown-list-board d-none">
          ${contactsList}
        </div>
    </section>
    <section id="task-popup-edit-button-container">
      <button id="save-popup-button" onclick="saveEditedPopupTask('${taskId}'); openTaskDetails('${taskId}'); hidePopupEditContainer()">Save</button>
      <button id="cancel-save-popup-button" onclick="openTaskDetails('${taskId}'); hidePopupEditContainer()">Cancel</button>
    </section>
  </section>
  `;
}

function renderTaskHTML({ taskId, taskTitle, taskDescription, categoryColor, taskCategory, assignedContactsHTML, progressHTML, taskPriority }) {
  return /*html*/ `
    <div id="${taskId}" class="task-board-container" onclick="openTaskDetails('${taskId}')" draggable="true" ondragstart="startDragging('${taskId}')">
      <div class="task-item-output task-category-wrapper">
        <div id="task-category-container" style="background-color: ${categoryColor}">${taskCategory}</div>
        <section class="dropdown-move-to-category-container" onclick="event.stopPropagation();">
          <button style="cursor: pointer;" id="dropbtn-category-dropdown-button-${taskId}" class="icon-options" onclick="event.stopPropagation(); showCategoryDropdown('${taskId}');"></button>
          <div id="category-dropdown${taskId}" class="category-dropdown-board-edit d-none" onclick="event.stopPropagation();">
            <section id="move-to-headline">
              <img style="height: 16px; width: 16px; -webkit-transform: scaleX(-1); transform: scaleX(-1);" src="./assets/img/arrow-left-line.svg" />
              <span style="font-weight: 700;">MOVE TO</span>
            </section> 
            <a href="#" onclick="event.stopPropagation(); moveTask('${taskId}', 'toDo')">To Do</a>
            <a href="#" onclick="event.stopPropagation(); moveTask('${taskId}', 'inProgress')">In Progress</a>
            <a href="#" onclick="event.stopPropagation(); moveTask('${taskId}', 'awaitFeedback')">Await feedback</a>
            <a href="#" onclick="event.stopPropagation(); moveTask('${taskId}', 'done')">Done</a>
          </div>
          <span class="tooltiptext">Click to <b>move Task</b> to a different category</span>
        </section>
      </div>
      <div class="task-item-output" id="task-title-container"><span>${taskTitle}</span></div>
      <div class="task-item-output" id="task-description-container"><span>${taskDescription}</span></div>
      ${progressHTML}
      <div id="task-bottom-row">
        <div class="task-board-contacts-wrapper">
          <div class="box-shadow-left-white"></div>
          <div onclick="preventklick(e); preventDragStart(e);" class="task-item-output" id="task-assignment-container">
            <div id="assigned-contacts-task-board">${assignedContactsHTML}</div>
          </div>
          <span class="tooltiptext">Use <b>SHIFT + Mousewheel</b> to scroll through contacts</span>
        </div>
        <div class="task-item-output" id="task-priority-container"><img src="${taskPriority}" id="task-priority-icon-task" alt="Priority Icon"/></div>
      </div>
    </div>`;
}

function renderProgressHTML(progress, completedSubtasks, totalSubtasks) {
  return /*html*/ `<div class="task-item-output" id="task-progress-container">
  <progress style="max-width: 150px;" value="${progress}" max="100"></progress>
  <span>${completedSubtasks}/${totalSubtasks} Subtasks</span>
</div>`;
}
