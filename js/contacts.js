/**
 * Array holding all contact objects.
 * @type {Array<Object>}
 */
let allContacts = [];

/**
 * Array of hex color strings used to assign random colors to contacts.
 * @type {Array<string>}
 */
let hexColors = ['#29abe2', '#4589ff', '#0038ff', '#ff3d00', '#ff745e', '#ffa35e', '#ff7a00', '#ffbb2b', '#ffe62b', '#ffc701', '#7ae229', '#1fd7c1', '#fc71ff', '#ff5eb3', '#9327ff', '#462f8a'];

/**
 * Initializes the contact page by loading contacts from local storage and checking for registered users.
 */
function initContact() {
  loadLocalStorage();
  checkRegisteredUser();
}

/**
 * Changes the background color of a specific contact element.
 * @param {number} i - The index of the contact element.
 */
function changeBackground(i) {
  let elements = document.querySelectorAll("[id^='contact-border']");
  elements.forEach(function (element) {
    element.classList.remove('blue-background', 'contact-border-no-hover');
  });
  document.getElementById(`contact-border${i}`).classList.add('blue-background', 'contact-border-no-hover');
}


/**
 * Returns a random color from the hexColors array.
 * @returns {string} - A random hex color code.
 */
function getRandomColor() {
  let randomColor = Math.floor(Math.random() * hexColors.length);
  return hexColors[randomColor];
}

/**
 * Formats an email string by replacing periods with commas and '@' with underscores.
 * @param {string} email - The email address to format.
 * @returns {string} - The formatted email address.
 */
function emailFormatted(email) {
  return email.replace('.', ',').replace('@', '_');
}

/**
 * Saves a new contact to the database.
 */
function saveContact() {
  let name = document.getElementById('contact-trial-name').value;
  let email = document.getElementById('contact-trial-email').value;
  let phone = document.getElementById('contact-trial-phone').value;
  let randomColor = getRandomColor();

  let contact = {
    name: name,
    email: email,
    phone: phone,
    color: randomColor,
  };

  document.getElementById('contact-trial-name').value = '';
  document.getElementById('contact-trial-email').value = '';
  document.getElementById('contact-trial-phone').value = '';

  let emailForm = emailFormatted(email);
  let database = firebase.database();
  let contactEntry = database.ref('contacts/' + emailForm);
  contactEntry.set(contact);
}

/**
 * Validates the contact form inputs and submits the contact if valid.
 * @param {Event} event - The form submission event.
 */
function validateAndSubmit(event) {
  event.preventDefault();

  let name = document.getElementById('contact-trial-name').value.trim();
  let email = document.getElementById('contact-trial-email').value.trim();
  let phone = document.getElementById('contact-trial-phone').value.trim();

  if (name && email && phone) {
    saveContact();
    closePupUpaddNewOrEdditContact();
    saveEditedContact();
  }
}

/**
 * Deletes a contact from the database.
 * @param {string} email - The email address of the contact to delete.
 */
function deleteContact(email) {
  let emailForm = emailFormatted(email);
  let database = firebase.database();
  let contactEntry = database.ref('contacts/' + emailForm);
  contactEntry.remove();
  document.getElementById('contact').classList.remove('translateX-null');
}

/**
 * Loads the contact data into the edit form.
 * @param {string} email - The email address of the contact to edit.
 */
function editContact(email) {
  let formEditContact = document.getElementById('form-container');
  let currentColor;
  let currentName;
  let currentEmail;
  let currentPhone;

  for (let i = 0; i < allContacts.length; i++) {
    if (email == allContacts[i]['email']) {
      currentColor = allContacts[i]['color'];
      currentEmail = allContacts[i]['email'];
      currentPhone = allContacts[i]['phone'];
      currentName = allContacts[i]['name'];
      break;
    }
  }

  formEditContact.innerHTML = renderFormEditContactHTML(currentEmail);

  document.getElementById('input-edit-name-contact').value = currentName;
  document.getElementById('input-edit-email-contact').value = currentEmail;
  document.getElementById('input-edit-phone-contact').value = currentPhone;
  renderPopupEditAddMiddle(email);
}


/**
 * Validates the contact edit form and closes the popup if valid.
 */
function validateAndClosePopup() {
  const name = document.getElementById('input-edit-name-contact').value.trim();
  const email = document.getElementById('input-edit-email-contact').value.trim();
  const phone = document.getElementById('input-edit-phone-contact').value.trim();

  if (name && email && phone) {
    closePupUpaddNewOrEdditContact();
  }
}

/**
 * Renders the middle section of the popup for editing or adding a contact.
 * @param {string} email - The email address of the contact to display.
 */
function renderPopupEditAddMiddle(email) {
  let popUpEditAddMiddle = document.getElementById('popUp-edit-add-middle');
  let currentColor;

  for (let i = 0; i < allContacts.length; i++) {
    if (email == allContacts[i]['email']) {
      currentColor = allContacts[i]['color'];
      currentName = allContacts[i]['name'];
      break;
    }
  }
  popUpEditAddMiddle.innerHTML = renderPopupEditAddMiddleHTML(currentColor, currentName);
  document.getElementById('first-letters-name-bg').style.backgroundColor = currentColor;
}

/**
 * Saves the edited contact information to the database.
 * @param {string} currentEmail - The original email address of the contact.
 */
function saveEditedContact(currentEmail) {
  let editName = document.getElementById('input-edit-name-contact').value;
  let editEmail = document.getElementById('input-edit-email-contact').value;
  let editTel = document.getElementById('input-edit-phone-contact').value;
  let editColor = document.getElementById('first-letters-name-bg').style.backgroundColor;

  let emailForm = emailFormatted(currentEmail);
  let newEmailForm = emailFormatted(editEmail);

  if (emailForm != newEmailForm) {
    deleteContact(emailForm);
  }

  let contact = {
    name: editName,
    email: editEmail,
    phone: editTel,
    color: editColor,
  };

  let database = firebase.database();

  let newContactEntry = database.ref('contacts/' + newEmailForm);
  newContactEntry.set(contact);

  loadContacts();
  showContactInfo(currentEmail);
  showContactResponsive(currentEmail);
}

/**
 * Generates initials from a contact name.
 * @param {string} string - The full name of the contact.
 * @returns {string} - The initials derived from the contact name.
 */
let getInitials = function (string) {
  let name = string.split(' '),
    initials = name[0].substring(0, 1).toUpperCase();

  if (name.length > 1) {
    initials += name[name.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

/**
 * Event listener for the DOMContentLoaded event to load contacts and set up click handling.
 */
document.addEventListener('DOMContentLoaded', function () {
  loadContacts();
  document.addEventListener('click', handleClickOutsidePopups);
});

/**
 * Handles clicks outside of popups to close them if clicked outside.
 * @param {Event} event - The click event.
 */
function handleClickOutsidePopups(event) {
  const popups = document.querySelectorAll('.add-new-or-edit-contact-popUp');
  let clickedOutside = true;

  popups.forEach((popup) => {
    if (popup.contains(event.target)) {
      clickedOutside = false;
    }
  });

  if (clickedOutside) {
    closePupUpaddNewOrEdditContact();
  }
}

/**
 * Opens the popup for adding a new contact.
 */
function addNewContactPopUp() {
  document.removeEventListener('click', handleClickOutsidePopups);
  document.getElementById('add-new-contact-popUp-bg').classList.remove('d-none');
  document.getElementById('add-new-contact-popUp-bg').classList.add('add-new-or-edit-contact-popUp-bg');
  document.getElementById('sidebar-menu').classList.add('z-index');
  document.getElementById('header').classList.add('z-index');

  setTimeout(() => {
    document.addEventListener('click', handleClickOutsidePopups);
  }, 100);
}

/**
 * Closes the popup for adding or editing a contact.
 */
function closePupUpaddNewOrEdditContact() {
  document.getElementById('add-new-contact-popUp-bg').classList.add('d-none');
  document.getElementById('edit-contact-popUp-bg').classList.add('d-none');
  document.getElementById('add-new-contact-popUp-bg').classList.remove('add-new-or-edit-contact-popUp-bg');
  document.getElementById('edit-contact-popUp-bg').classList.remove('add-new-or-edit-contact-popUp-bg');
  document.getElementById('sidebar-menu').classList.remove('z-index');
  document.getElementById('header').classList.remove('z-index');

  document.removeEventListener('click', handleClickOutsidePopups);
  setTimeout(() => {
    document.addEventListener('click', handleClickOutsidePopups);
  }, 100);
}

/**
 * Opens the popup for editing a contact.
 * Removes the click event listener for handling clicks outside popups, shows the popup, and re-adds the listener after a short delay.
 */
function editContactPopUp() {
  document.removeEventListener('click', handleClickOutsidePopups);
  document.getElementById('edit-contact-popUp-bg').classList.remove('d-none');
  document.getElementById('edit-contact-popUp-bg').classList.add('add-new-or-edit-contact-popUp-bg');
  document.getElementById('sidebar-menu').classList.add('z-index');
  document.getElementById('header').classList.add('z-index');
  setTimeout(() => {
    document.addEventListener('click', handleClickOutsidePopups);
  }, 100);
}

/**
 * Displays detailed contact information in the contact view.
 * @param {string} email - The email address of the contact to be displayed.
 */
function showContactInfo(email) {
  document.getElementById('contact').classList.add('translateX-null');
  let database = firebase.database();
  let contact = document.getElementById('contact');
  let currentColor;
  let currentName;
  let currentEmail;
  let currentPhone;

  for (let i = 0; i < allContacts.length; i++) {
    if (email == allContacts[i]['email']) {
      currentColor = allContacts[i]['color'];
      currentEmail = allContacts[i]['email'];
      currentPhone = allContacts[i]['phone'];
      currentName = allContacts[i]['name'];
      break;
    }
  }

  contact.innerHTML = renderShowContactInfo(currentColor, currentName, currentEmail, currentPhone);
}

/**
 * Displays contact information in a responsive view for smaller screens.
 * @param {string} email - The email address of the contact to be displayed.
 * @param {number} j - Index or identifier used in rendering the responsive contact view.
 */
function showContactResponsive(email, j) {
  let width = window.innerWidth;
  if (width <= 1050) {
    document.getElementById('contacts-list').classList.add('display-none');
    document.getElementById('contacts-container-responsive').classList.add('d-unset');
    document.getElementById('back-icon').classList.add('d-unset');
  }

  let database = firebase.database();
  let contactResponisve = document.getElementById('contact-responsive');
  let currentColor;
  let currentName;
  let currentEmail;
  let currentPhone;

  for (let i = 0; i < allContacts.length; i++) {
    if (email == allContacts[i]['email']) {
      currentColor = allContacts[i]['color'];
      currentEmail = allContacts[i]['email'];
      currentPhone = allContacts[i]['phone'];
      currentName = allContacts[i]['name'];
      break;
    }
  }

  contactResponisve.innerHTML = renderContactResponisveHTML(j, currentColor, currentName, currentEmail, currentPhone);
}


/**
 * Closes the detailed contact view and restores the contact list display.
 */
function closeContact() {
  document.getElementById('contacts-list').classList.remove('display-none');
  document.getElementById('contacts-container-responsive').classList.remove('d-unset');
  document.getElementById('back-icon').classList.remove('d-unset');

  let elements = document.querySelectorAll("[id^='contact-border']");
  elements.forEach(function (element) {
    element.classList.remove('blue-background', 'contact-border-no-hover');
    element.classList.add('contact-border');
  });
}

/**
 * Closes the popup for editing or deleting a contact.
 */
function closePopUpEditDelete() {
  document.getElementById('PopUp-edit-delete-bg').classList.add('display-none');
}

/**
 * Opens the popup for editing or deleting a contact.
 */
function openPopUpEditDelete() {
  document.getElementById('PopUp-edit-delete-bg').classList.remove('display-none');
}

/**
 * Loads all contacts from the database and updates the contact list display.
 */
function loadContacts() {
  let database = firebase.database();
  let contactEntries = database.ref('contacts');

  contactEntries.on('value', function (snapshot) {
    let contactsListContent = document.getElementById('contacts-list-content');
    contactsListContent.innerHTML = '';

    allContacts = [];
    let childSnapshots = [];
    snapshot.forEach(function (childSnapshot) {
      childSnapshots.push(childSnapshot);
    });

    for (let i = 0; i < childSnapshots.length; i++) {
      let contact = childSnapshots[i].val();
      allContacts.push(contact);
    }

    allContacts.sort((a, b) => a.name.localeCompare(b.name));

    let currentInitial = '';
    for (let i = 0; i < allContacts.length; i++) {
      let contact = allContacts[i];
      let initial = contact.name.charAt(0).toUpperCase();

      if (initial !== currentInitial) {
        currentInitial = initial;
        contactsListContent.innerHTML += renderLine(initial);
      }

      contactsListContent.innerHTML += renderContactHTML(contact, i);
    }
  });
}
