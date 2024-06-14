const firebaseConfig = {
  apiKey: "AIzaSyATlm1AEC2Od7yyUHuG1TltVYy6ngr5wz8",
  authDomain: "join-kanban-board.firebaseapp.com",
  databaseURL:
    "https://join-kanban-board-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-kanban-board",
  storageBucket: "join-kanban-board.appspot.com",
  messagingSenderId: "792357613718",
  appId: "1:792357613718:web:9625e035b829013afad2b7",
};

firebase.initializeApp(firebaseConfig);

function emailFormatted(email) {
  return email.replace(".", ",").replace("@", "_");
}

function saveContact() {
  let name = document.getElementById("contact-trial-name").value;
  let email = document.getElementById("contact-trial-email").value;
  let phone = document.getElementById("contact-trial-phone").value;

  let contact = {
    name: name,
    email: email,
    phone: phone,
  };

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

    snapshot.forEach(function (childSnapshot) {
      let contact = childSnapshot.val();
      let initials = getInitials(contact.name);

      contactsContainer.innerHTML += /*html*/ `
          <div id="contact-entry">
            <div id="contact-trial-name-container">Name: ${contact.name}</div>
            <div id="contact-trial-email-container">Email: ${contact.email}</div>
            <div id="contact-trial-phone-container">Telefonnummer: ${contact.phone}</div>
            <div id="contact-trial-initial-container">${initials}</div>
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


window.onload = loadContacts;

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
