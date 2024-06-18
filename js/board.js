function openTaskDetails() {
  let taskDetails = document.getElementById('task');
  taskDetails.style.display = 'flex';

  taskDetails.innerHTML = '';
  taskDetails.innerHTML += /*html*/`
    <div id="popup-task-container" class="popup-task-container" onclick="doNotClose(event)">
      <h4>User Story</h4>
      <h2>Contact Form & Imprint</h2>
      <p>Crate a contact from and imprint page..</p>
      <span class="popup-span">Due date: 10/05/2024</span>
      <div class="popup-priority-container">
        <span class="popup-span">Priority:</span>
        <div class="popup-priority-img-container">Medium <img src="./assets/img/medium_icon.png" ></div>
      </div>
      <div >
        <span class="popup-span">Assigned To:</span>
        <div class="popup-badge-container"><div class="sub-badge-container badge-kt">KT</div><span>Karina Tanei</span></div>
        <div class="popup-badge-container"><div class="sub-badge-container badge-bt">BT</div><span>Bünyamin T</span></div>
        <div class="popup-badge-container"><div class="sub-badge-container badge-fk">BT</div><span>Felix Kroth</span></div>
      </div>
      <div class="popup-subtasks-container">
       <span class="popup-span">Subtasks</span>
       <div class="popup-subtask-container">
         <input type="checkbox">
         <span>Implement Recipe Recommendation</span>
       </div>
       <div class="popup-subtask-container">
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
        <img src="./assets/img/pen_DARK.png">
        <span> Edit </span>
      </div>
    </div>
    </div>
    `;

  setTimeout(() => {
    document.getElementById('popup-task-container').classList.add('animate-popup-task-container');
  }, 200);

}

function closePopup() {
  let taskDetails = document.getElementById('task');
  taskDetails.style.display = 'none';
}

function doNotClose(event) {
  event.stopPropagation();
}

function filterTask() {
  let search = document.getElementById("search").value;
  search = search.toLowerCase();
  if (search.length > 2) {
    let content = document.getElementById("content");
    content.innerHTML = "";
    // for (let i = 0; i < data.length; i++) {
    //   const pokemonName = data[i]["name"];
    //   if (pokemonName.toLowerCase().includes(search)) {
    //     let pokemonData = data[i];
    //     content.innerHTML += renderCards(i, pokemonData);
    //     rendertypes(i, pokemonData);
    //   }
    // } 
  }
}