/**
 * @type {string | undefined} 
 * Holds the ID of the currently registered user.
 */
let registeredID;

/**
 * Initializes the page after the DOM content has been loaded.
 * Sets up event listeners and applies specific styles based on local storage.
 */
document.addEventListener('DOMContentLoaded', function () {
  includeHTML(() => {
    setTimeout(() => {
      activateCurrentLink();
    }, 100);

    let index = localStorage.getItem('bgColor');
    let anchor = document.getElementById(index);
    if (anchor) {
      anchor.style.backgroundColor = '#091931';
      localStorage.removeItem('bgColor');
    }

    window.addEventListener('resize', activateCurrentLink);
  });
});

/**
 * Includes HTML content from external files specified by the `w3-include-html` attribute.
 * @param {Function} callback - The function to be called after including HTML content.
 */
function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName('*');
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute('w3-include-html');
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = 'Page not found.';
          }
          elmnt.removeAttribute('w3-include-html');
          includeHTML(callback);

          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      };
      xhttp.open('GET', file, true);
      xhttp.send();
      return;
    }
  }
}

/**
 * Activates the link corresponding to the current page.
 * Adds an 'active-link' class to the relevant menu items based on the current page URL.
 */
function activateCurrentLink() {
    /**
   * @type {Object<string, string[]>}
   * Maps page filenames to their respective link element IDs.
   */
  let links = {
    'summary.html': ['summary-menu-icon', 'mobile-menu-icon-summary'],
    'addtask.html': ['addtask-menu-icon', 'mobile-menu-icon-addtask'],
    'board.html': ['board-menu-icon', 'mobile-menu-icon-board'],
    'contacts.html': ['contacts-menu-icon', 'mobile-menu-icon-contacts'],
    'privacy.html': ['sidebar-menu-privacy', 'privacy-icon-container'],
    'imprint.html': ['sidebar-menu-imprint', 'imprint-icon-container'],
  };

  const currentPage = window.location.pathname.split('/').pop();
  const activeLinkIds = links[currentPage];

  if (activeLinkIds) {
    activeLinkIds.forEach(id => {
      let activeLinkElement = document.getElementById(id);
      if (activeLinkElement) {
        activeLinkElement.classList.add('active-link');
      }
    });
  }
}

/**
 * Navigates to a specified link and stores the background color ID in local storage.
 * @param {string} link - The URL to navigate to.
 * @param {string} id - The ID used to store the background color in local storage.
 */
function openSite(link, id) {
  localStorage.setItem('bgColor', id);
  window.location.href = link;
}

/**
 * Navigates to the help page.
 */
function goToHelp() {
  window.location.href = 'help.html';
}


/**
 * Checks if a registered user is logged in and updates the UI accordingly.
 * Redirects to the index page if no registered user is found.
 */
function checkRegisteredUser() {
    /**
   * @type {boolean}
   * Indicates whether a registered user is logged in.
   */
  let logged = false;
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i]['registered'] == true) {
      logged = true;
      document.getElementById('sub-contact-initial-container').innerHTML = allUsers[i]['initial'];
      registeredID = allUsers[i]['id'];
      break;
    }
  }
  if (logged == false) {
    window.location.href = 'index.html';
  }
  saveLocalStorage();
}

/**
 * Logs out the user by setting their registered status to false in the database.
 * Redirects to the index page after logging out.
 * @param {string} registeredID - The ID of the registered user to log out.
 */
function logout(registeredID) {
  let database = firebase.database();
  if (registeredID) {
    let userEntry = database.ref('users/' + registeredID + '/registered/');
    userEntry.set(false);
    saveLocalStorage();
  }
  window.location.href = 'index.html';
}

/**
 * Toggles the visibility of the logout container.
 * Displays the container if hidden, or hides it if visible.
 */
function toggleShowLogout() {
  checkRegisteredUser();
  let logoutContainer = document.getElementById('showLogout');
  logoutContainer.innerHTML = renderLogout(registeredID);

  if (logoutContainer.style.display == 'flex') {
    logoutContainer.style.display = 'none';
    document.removeEventListener('click', handleClickOutside);
  } else {
    logoutContainer.style.display = 'flex';
    
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
  }

  logoutContainer.addEventListener('click', function(event) {
    event.stopPropagation();
  });
}

/**
 * Handles clicks outside the logout container to hide it.
 * @param {Event} event - The click event.
 */
function handleClickOutside(event) {
  let logoutContainer = document.getElementById('showLogout');

  if (logoutContainer && !logoutContainer.contains(event.target)) {
    logoutContainer.style.display = 'none';
    document.removeEventListener('click', handleClickOutside);
  }
}

/**
 * Saves the `allUsers` array to local storage.
 */
function saveLocalStorage() {
  let allUsersAsText = JSON.stringify(allUsers);
  localStorage.setItem('Users', allUsersAsText);
}

/**
 * Loads the `allUsers` array from local storage.
 */
function loadLocalStorage() {
  /**
   * @type {string | null}
   * JSON string representation of `allUsers` array from local storage.
   */
  let allUsersAsText = localStorage.getItem('Users');
  if (allUsersAsText) {
    /**
     * @type {Array<Object>}
     * Array of user objects loaded from local storage.
     */
    allUsers = JSON.parse(allUsersAsText);
  }
}

/**
 * Navigates to the privacy, imprint, or help page based on the clicked element.
 * @param {Event} event - The click event that triggered this function.
 */
async function goToPrivacyOrImprintOrHelp(event) {
  const id = event.currentTarget.id;
  await checkUser();
  if (id === 'imprint-icon-container') {
    window.location.href = 'imprint.html';
  } else if (id === 'privacy-icon-container') {
    window.location.href = 'privacy.html';
  } else if (id === 'help-icon-container') {
    window.location.href = 'help.html';
  }
}

/**
 * Checks the user registration status and updates accordingly.
 * If no registered user is found, assigns the 'Guest' user as registered.
 */
async function checkUser() {
    /**
   * @type {boolean}
   * Indicates whether a registered user is found.
   */
  let logged = false;
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i]['registered'] == true) {
      logged = true;
      document.getElementById('sub-contact-initial-container').innerHTML = allUsers[i]['initial'];
      registeredID = allUsers[i]['id'];
      break;
    }
  }
  if (logged == false) {
    let user = allUsers.find((u) => u.name == 'Guest');
    registeredID = user['id'];
    let userEntry = database.ref('users/' + registeredID + '/registered/');
    await userEntry.set(true);
    saveLocalStorage();
  }
}
