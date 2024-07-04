let allContacts = [];
let hexColors = [
  "#29abe2",
  "#4589ff",
  "#0038ff",
  "#ff3d00",
  "#ff745e",
  "#ffa35e",
  "#ff7a00",
  "#ffbb2b",
  "#ffe62b",
  "#ffc701",
  "#7ae229",
  "#1fd7c1",
  "#fc71ff",
  "#ff5eb3",
  "#9327ff",
  "#462f8a",
];

function initContact() {
  loadLocalStorage();
  checkRegisteredUser();
}

function changeBackground(i) {
  let elements = document.querySelectorAll("[id^='contact-border']");
  elements.forEach(function (element) {
    element.classList.remove("blue-background", "contact-border-no-hover");
  });
  // document.getElementById(`contact-border${i}`).classList.add("blue-background");
  document.getElementById(`contact-border${i}`).classList.add("blue-background", "contact-border-no-hover");
}

function getRandomColor() {
  let randomColor = Math.floor(Math.random() * hexColors.length);
  return hexColors[randomColor];
}

function emailFormatted(email) {
  return email.replace(".", ",").replace("@", "_");
}

function saveContact() {
  let name = document.getElementById("contact-trial-name").value;
  let email = document.getElementById("contact-trial-email").value;
  let phone = document.getElementById("contact-trial-phone").value;
  let randomColor = getRandomColor();

  let contact = {
    name: name,
    email: email,
    phone: phone,
    color: randomColor,
  };

  document.getElementById("contact-trial-name").value = "";
  document.getElementById("contact-trial-email").value = "";
  document.getElementById("contact-trial-phone").value = "";

  let emailForm = emailFormatted(email);
  let database = firebase.database();
  let contactEntry = database.ref("contacts/" + emailForm);
  contactEntry.set(contact);
}

function validateAndSubmit(event) {
  event.preventDefault();

  let name = document.getElementById("contact-trial-name").value.trim();
  let email = document.getElementById("contact-trial-email").value.trim();
  let phone = document.getElementById("contact-trial-phone").value.trim();

  if (name && email && phone) {
    saveContact();
    closePupUpaddNewOrEdditContact();
    saveEditedContact();
  }
}

function deleteContact(email) {
  let emailForm = emailFormatted(email);
  let database = firebase.database();
  let contactEntry = database.ref("contacts/" + emailForm);
  contactEntry.remove();
  document.getElementById("contact").classList.remove("translateX-null");
}

function editContact(email) {
  let formEditContact = document.getElementById("form-container");
  let currentColor;
  let currentName;
  let currentEmail;
  let currentPhone;

  for (let i = 0; i < allContacts.length; i++) {
    if (email == allContacts[i]["email"]) {
      currentColor = allContacts[i]["color"];
      currentEmail = allContacts[i]["email"];
      currentPhone = allContacts[i]["phone"];
      currentName = allContacts[i]["name"];
      break;
    }
  }

  formEditContact.innerHTML = renderFormEditContactHTML(currentEmail);

  document.getElementById("input-edit-name-contact").value = currentName;
  document.getElementById("input-edit-email-contact").value = currentEmail;
  document.getElementById("input-edit-phone-contact").value = currentPhone;
  renderPopupEditAddMiddle(email);
}

function validateAndClosePopup() {
  const name = document.getElementById("input-edit-name-contact").value.trim();
  const email = document
    .getElementById("input-edit-email-contact")
    .value.trim();
  const phone = document
    .getElementById("input-edit-phone-contact")
    .value.trim();

  if (name && email && phone) {
    closePupUpaddNewOrEdditContact();
  }
}

function renderPopupEditAddMiddle(email) {
  let popUpEditAddMiddle = document.getElementById("popUp-edit-add-middle");
  let currentColor;

  for (let i = 0; i < allContacts.length; i++) {
    if (email == allContacts[i]["email"]) {
      currentColor = allContacts[i]["color"];
      currentName = allContacts[i]["name"];
      break;
    }
  }
  popUpEditAddMiddle.innerHTML = renderPopupEditAddMiddleHTML(
    currentColor,
    currentName
  );
  document.getElementById("first-letters-name-bg").style.backgroundColor =
    currentColor;
}

function saveEditedContact(currentEmail) {
  let editName = document.getElementById("input-edit-name-contact").value;
  let editEmail = document.getElementById("input-edit-email-contact").value;
  let editTel = document.getElementById("input-edit-phone-contact").value;
  let editColor = document.getElementById("first-letters-name-bg").style
    .backgroundColor;

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

  let newContactEntry = database.ref("contacts/" + newEmailForm);
  newContactEntry.set(contact);

  loadContacts();
  showContactInfo(currentEmail);
  showContactResponsive(currentEmail);
}

let getInitials = function (string) {
  let name = string.split(" "),
    initials = name[0].substring(0, 1).toUpperCase();

  if (name.length > 1) {
    initials += name[name.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

document.addEventListener("DOMContentLoaded", function () {
  loadContacts();
});

function addNewContactPopUp() {
  document
    .getElementById("add-new-contact-popUp-bg")
    .classList.add("add-new-or-edit-contact-popUp-bg");
}

function closePupUpaddNewOrEdditContact() {
  document
    .getElementById("add-new-contact-popUp-bg")
    .classList.remove("add-new-or-edit-contact-popUp-bg");
  document
    .getElementById("edit-contact-popUp-bg")
    .classList.remove("add-new-or-edit-contact-popUp-bg");
}

function editContactPopUp() {
  document
    .getElementById("edit-contact-popUp-bg")
    .classList.add("add-new-or-edit-contact-popUp-bg");
}

function showContactInfo(email) {
  document.getElementById("contact").classList.add("translateX-null");
  let database = firebase.database();
  let contact = document.getElementById("contact");
  let currentColor;
  let currentName;
  let currentEmail;
  let currentPhone;

  for (let i = 0; i < allContacts.length; i++) {
    if (email == allContacts[i]["email"]) {
      currentColor = allContacts[i]["color"];
      currentEmail = allContacts[i]["email"];
      currentPhone = allContacts[i]["phone"];
      currentName = allContacts[i]["name"];
      break;
    }
  }

  contact.innerHTML = renderShowContactInfo(
    currentColor,
    currentName,
    currentEmail,
    currentPhone
  );
}

function showContactResponsive(email, j) {
  let width = window.innerWidth;
  if (width <= 1050) {
    document.getElementById("contacts-list").classList.add("display-none");
    document
      .getElementById("contacts-container-responsive")
      .classList.add("d-unset");
    document.getElementById("back-icon").classList.add("d-unset");
  }

  let database = firebase.database();
  let contactResponisve = document.getElementById("contact-responsive");
  let currentColor;
  let currentName;
  let currentEmail;
  let currentPhone;

  for (let i = 0; i < allContacts.length; i++) {
    if (email == allContacts[i]["email"]) {
      currentColor = allContacts[i]["color"];
      currentEmail = allContacts[i]["email"];
      currentPhone = allContacts[i]["phone"];
      currentName = allContacts[i]["name"];
      break;
    }
  }

  contactResponisve.innerHTML = renderContactResponisveHTML(
    j,
    currentColor,
    currentName,
    currentEmail,
    currentPhone
  );
}

function closeContact() {
  document.getElementById("contacts-list").classList.remove("display-none");
  document
    .getElementById("contacts-container-responsive")
    .classList.remove("d-unset");
  document.getElementById("back-icon").classList.remove("d-unset");
  // document
  //   .getElementById(`contact-border${j}`)
  //   .classList.remove("blue-background");

    let elements = document.querySelectorAll("[id^='contact-border']");
    elements.forEach(function (element) {
      element.classList.remove("blue-background", "contact-border-no-hover");
      element.classList.add('contact-border');
    });
}

function closePopUpEditDelete() {
  document.getElementById("PopUp-edit-delete-bg").classList.add("display-none");
}

function openPopUpEditDelete() {
  document
    .getElementById("PopUp-edit-delete-bg")
    .classList.remove("display-none");
}

function loadContacts() {
  let database = firebase.database();
  let contactEntries = database.ref("contacts");

  contactEntries.on("value", function (snapshot) {
    let contactsListContent = document.getElementById("contacts-list-content");
    contactsListContent.innerHTML = "";

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

    let currentInitial = "";
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
