const firebaseConfig = {
  apiKey: "AIzaSyATlm1AEC2Od7yyUHuG1TltVYy6ngr5wz8",
  authDomain: "join-kanban-board.firebaseapp.com",
  databaseURL: "https://join-kanban-board-default-rtdb.europe-west1.firebasedatabase.app",
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
    "name": name,
    "email": email,
    "phone": phone,
  };

  let emailForm = emailFormatted(email);
  let database = firebase.database();
  let contactEntry = database.ref("contacts/" + emailForm);
  contactEntry.set(contact)
}


function deleteContact(email) {
  let emailForm = emailFormatted(email);
  let database = firebase.database();
  let contactEntry = database.ref("contacts/" + emailForm);

  contactEntry.remove()
}


function loadContacts() {
  let database = firebase.database();
  let contactEntries = database.ref("contacts");

  contactEntries.on("value", function (snapshot) {
    let contactsContainer = document.getElementById("contacts-trial-container");
    contactsContainer.innerHTML = ""; 

    snapshot.forEach(function (childSnapshot) {
      let contact = childSnapshot.val();

      contactsContainer.innerHTML += /*html*/ `
          <div id="contact-entry">
            <div id="contact-trial-name-container">Name: ${contact.name}</div>
            <div id="contact-trial-email-container">Email: ${contact.email}</div>
            <div id="contact-trial-phone-container">Telefonnummer: ${contact.phone}</div>
            <button onclick="deleteContact('${contact.email}')">Löschen</button>
          </div>`;
    });
  });
}


window.onload = loadContacts;

function init(){
  document.getElementById('add-new-contact-popUp-Bg-Id').classList.add('d-none');
}

function addNewContact(){
    document.getElementById('add-new-contact-popUp-Bg-Id').classList.add('popUp-add-new-contact-Bg');
}
