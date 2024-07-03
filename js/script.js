// W3SCHOOLS INCLUDE HTML TEMPLATE SCRIPT - START
let registeredID;
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

function goToHelp() {
  window.location.href = 'help.html';
}

function checkRegisteredUser() {
  let loged = false;
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i]['registered'] == true) {
      loged = true;
      document.getElementById('sub-contact-initial-container').innerHTML = allUsers[i]['initial'];
      registeredID = allUsers[i]['id'];
      break;
    }
  }
  if (loged == false) {
    window.location.href = 'index.html';
  }
  saveLocalStorage();
}

function logout(registeredID) {
  let database = firebase.database();
  if (registeredID) {
    let userEntry = database.ref("users/" + registeredID + "/registered/");
    userEntry.set(false);
    saveLocalStorage();
  }
  window.location.href = 'index.html';
}


function toggleShowLogout(registeredID) {
  let logoutContainer = document.getElementById('showLogout');
  logoutContainer.innerHTML = `
   <div class="popout-showlogout">
      <a href="imprint.html">Legal Notice</a>
      <a href="privacy.html">Privacy Policy</a>
      <a onclick="logout('${registeredID}')" href="#">Log Out</a>
    </div>`;
  if (logoutContainer.style.display == 'flex') {
    logoutContainer.style.display = 'none';
  } else {
    logoutContainer.style.display = 'flex';
  }
}


function saveLocalStorage() {
  let allUsersAsText = JSON.stringify(allUsers);
  localStorage.setItem("Users", allUsersAsText);
}

function loadLocalStorage() {
  let allUsersAsText = localStorage.getItem("Users");
  if (allUsersAsText) {
    allUsers = JSON.parse(allUsersAsText);
  }
}

async function goToPrivacyOrImprintOrHelp() {
  let privacy = document.getElementById('privacy');
  let imprint = document.getElementById('imprint');
  let help = document.getElementById('help-icon-container');
  let database = firebase.database();
  await checkUser();
  if (imprint) {
    window.location.href = 'imprint.html';
  }
  if (privacy) {
    window.location.href = 'privacy.html';
  }
  if (help) {
    window.location.href = 'help.html';
  }
}

async function checkUser(){
  let loged = false;
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i]['registered'] == true) {
      loged = true;
      document.getElementById('sub-contact-initial-container').innerHTML = allUsers[i]['initial'];
      registeredID = allUsers[i]['id'];
      break;
    }
  }
  if (loged == false) {
    let user = allUsers.find(u => u.name == 'Guest');
    registeredID = user['id'];
    let userEntry = database.ref("users/" + registeredID + "/registered/");
    await userEntry.set(true);
    saveLocalStorage();
  }
}


