let allContacts = [];
let hexColors = ['#29abe2', '#4589ff', '#0038ff', '#ff3d00', '#ff745e', '#ffa35e', '#ff7a00', '#ffbb2b', '#ffe62b', '#ffc701', '#7ae229', '#1fd7c1', '#fc71ff', '#ff5eb3', '#9327ff', '#462f8a'];


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
    color: randomColor
  };

  document.getElementById("contact-trial-name").value = '';
  document.getElementById("contact-trial-email").value = '';
  document.getElementById("contact-trial-phone").value = '';

  let emailForm = emailFormatted(email);
  let database = firebase.database();
  let contactEntry = database.ref("contacts/" + emailForm);
  contactEntry.set(contact);
}


function deleteContact(email) {
  let emailForm = emailFormatted(email);
  let database = firebase.database();
  let contactEntry = database.ref("contacts/" + emailForm);
  contactEntry.remove();
}


function loadContacts() {
  let database = firebase.database();
  let contactEntries = database.ref("contacts");

  contactEntries.on("value", function (snapshot) {
    let contactsContainer = document.getElementById("contacts-trial-container");
    contactsContainer.innerHTML = "";

    allContacts = [];
    snapshot.forEach(function (childSnapshot) {
      let contact = childSnapshot.val();
      allContacts.push(contact);

      contactsContainer.innerHTML += /*html*/ `
          <div id="contact-entry">
            <div style="background: ${contact.color}" id="contact-trial-initial-container">${getInitials(contact.name)}</div>
            <div id="contact-trial-name-container">Name: ${contact.name}</div>
            <div id="contact-trial-email-container">Email: ${contact.email}</div>
            <div id="contact-trial-phone-container">Telefonnummer: ${contact.phone}</div>
            <button onclick="deleteContact('${contact.email}')">Löschen</button>
          </div>`;
    });
  });
}


let getInitials = function (string) {
  let name = string.split(" "),
    initials = name[0].substring(0, 1).toUpperCase();

  if (name.length > 1) {
    initials += name[name.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};


document.addEventListener('DOMContentLoaded', function() {
    loadContacts();
});


function init() {
  document.getElementById("add-new-contact-popUp-bg").classList.add("d-none");
  document.getElementById("edit-contact-popUp-bg").classList.add("d-none");
}


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
