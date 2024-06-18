function openTaskDetails() {
    let taskDetails = document.getElementById('task');
    taskDetails.style.display = 'flex';
    taskDetails.innerHTML = '';
    taskDetails.innerHTML += /*html*/`
    <div class="popup-task-container" onclick="doNotClose(event)">
      <h4>User Story</h4>
      <h2>Contact Form & Imprint</h2>
      <p>Crate a contact from and imprint page..</p>
      <span>Due date: 10/05/2024</span>
      <div class="popup-priority-container">
        <span>Priority:</span>
        <div class="popup-priority-img-container">Medium <img src="./assets/img/medium_icon.png" ></div>
      </div>
      <div>Assigned To:
        <div class="popup-badge-container"><img src="./assets/img/badge_dark_purple.png"><span>Basel Za</span></div>
        <div class="popup-badge-container"><img src="./assets/img/badge_dark_yellow.png"><span>Tim Welmer</span></div>
      </div>
      <div>
       <span>Subtasks</span>
       <div>
         <input type="checkbox">
         <span>Implement Recipe Recommendation</span>
       </div>
       <div>
         <input type="checkbox">
         <span>Start Page Layout</span>
       </div>
      </div>
    <div class="popup-modify-delete-container">
      <div class="popup-del-edit">
        <img src="./assets/img/delete_icon.png">
        <span> Delete </span>
      </div>
      <div class="popup-del-edit">
        <img src="./assets/img/delete_icon.png">
        <span> Edit </span>
      </div>
    </div>
    </div>
    `;
}

function closePopup() {
    let taskDetails = document.getElementById('task');
    taskDetails.style.display = 'none';
}

function doNotClose(event) {
    event.stopPropagation();
}