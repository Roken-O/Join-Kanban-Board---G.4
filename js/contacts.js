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


// function loadContacts() {
//   let database = firebase.database();
//   let contactEntries = database.ref("contacts");

//   contactEntries.on("value", function (snapshot) {
//     let contactsContainer = document.getElementById("contacts-trial-container");
//     contactsContainer.innerHTML = "";

//     allContacts = [];
//     snapshot.forEach(function (childSnapshot) {
//       let contact = childSnapshot.val();
//       allContacts.push(contact);

//       contactsContainer.innerHTML += /*html*/ `
//           <div id="contact-entry">
//             <div style="background: ${contact.color}" id="contact-trial-initial-container">${getInitials(contact.name)}</div>
//             <div id="contact-trial-name-container">Name: ${contact.name}</div>
//             <div id="contact-trial-email-container">Email: ${contact.email}</div>
//             <div id="contact-trial-phone-container">Telefonnummer: ${contact.phone}</div>
//             <button onclick="deleteContact('${contact.email}')">Löschen</button>
//             <button onclick="editContact('${contact.email}')">edit</button>
           
//           </div>`;
//     });
//   });
// }

function editContact(email) {
  let editContactTrial1 = document.getElementById('edit-contactt');
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

  editContactTrial1.innerHTML = `
      <input type="text" id="edit-contact-trial-name-container">
      <input type="email" id="edit-contact-trial-email-container" >
      <input type="text" id="edit-contact-trial-phone-container" >
      <button onclick="saveEditedContact('${email}')">Save</button>
    `;

  document.getElementById('edit-contact-trial-name-container').value = currentName;
  document.getElementById('edit-contact-trial-email-container').value = currentEmail;
  document.getElementById('edit-contact-trial-phone-container').value = currentPhone;
  document.getElementById('edit-contact-trial-phone-container').style.backgroundColor = currentColor;
}

function saveEditedContact(currentEmail) {
  let editName = document.getElementById('edit-contact-trial-name-container').value;
  let editEmail = document.getElementById('edit-contact-trial-email-container').value;
  let editTel = document.getElementById('edit-contact-trial-phone-container').value;
  let editColor = document.getElementById('edit-contact-trial-phone-container').style.backgroundColor;

  let emailForm = emailFormatted(currentEmail);
  let newEmailForm = emailFormatted(editEmail);

  if (emailForm != newEmailForm) {

    deleteContact(emailForm);
  }

  let contact = {
    name: editName,
    email: editEmail,
    phone: editTel,
    color: editColor
  };

  let database = firebase.database();

  // let contactEntryColor = database.ref("contacts/" + emailForm + "/color");
  // let contactEntryName = database.ref("contacts/" + emailForm + "/name");
  // let contactEntryEmail = database.ref("contacts/" + emailForm + "/email");
  // let contactEntryTel = database.ref("contacts/" + emailForm + "/phone");

  let newContactEntry = database.ref("contacts/" + newEmailForm);
  newContactEntry.set(contact);

  // contactEntryColor.set(editColor)
  // contactEntryName.set(editName);
  // contactEntryEmail.set(editEmail);
  // contactEntryTel.set(editTel);

  loadContacts();
}

let getInitials = function (string) {
  let name = string.split(" "),
    initials = name[0].substring(0, 1).toUpperCase();

  if (name.length > 1) {
    initials += name[name.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};


document.addEventListener('DOMContentLoaded', function () {
  loadContacts();
});


function init() {
  document.getElementById("add-new-contact-popUp-bg").classList.add("d-none");
  document.getElementById("edit-contact-popUp-bg").classList.add("d-none");
  document.getElementById("PopUp-edit-delete-bg").classList.add("display-none");
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

function showContactInfo(email) {
  document.getElementById("contact").classList.add("translateX-null");
  let database = firebase.database();
  // let contactEntries = database.ref("contacts");

  let contact = document.getElementById("contact");
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

  // contactEntries.on("value", function (snapshot) {
  //   let contactsContainer = document.getElementById("contact");
  //   contactsContainer.innerHTML = "";

  //   allContacts = [];
  //   snapshot.forEach(function (childSnapshot) {
  //     let contact = childSnapshot.val();
  //     allContacts.push(contact);

  contact.innerHTML = /*html*/ `
      <div class="flex-align-center contact-pic-name-container">
            <div class="first-letters-name-bg">
              <span class="first-letters-name">AM</span>
            </div>
            <div id="contact-name">
              <h2>${currentName}</h2>
              <div class="flex-align-center" id="contact-edit-delete">
                <div
                  onclick="editContactPopUp()"
                  class="flex-align-center"
                  id="contact-edit"
                >
                  <img
                    class="contact-pen-delete-img"
                    src="assets/img/pen_DARK.svg"
                    alt=""
                  />
                  <span>Edit</span>
                </div>
                <div class="flex-align-center" id="contact-delete">
                  <img
                    class="contact-pen-delete-img"
                    src="/assets/img/delete_icon.svg"
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
  //   });
  // });
}

function showContactResponsive() {
  let width = window.innerWidth;
  if (width <= 1050) {
    document.getElementById("contacts-list").classList.add("display-none");
    document.getElementById("contacts-container-responsive").classList.add("d-unset");
    document.getElementById("back-icon").classList.add("d-unset");

  }
}

function closeContact() {
  document.getElementById("contacts-list").classList.remove("display-none");
  document.getElementById("contacts-container-responsive").classList.remove("d-unset");
  document.getElementById("back-icon").classList.remove("d-unset");
}

function closePopUpEditDelete() {
  document.getElementById("PopUp-edit-delete-bg").classList.add("display-none");
}

function openPopUpEditDelete() {
  document.getElementById("PopUp-edit-delete-bg").classList.remove("display-none");
}

// new

function loadContacts() {
  let database = firebase.database();
  let contactEntries = database.ref("contacts");

  contactEntries.on("value", function (snapshot) {
    let contactsListContent = document.getElementById("contacts-list-content");
    contactsListContent.innerHTML = "";

    allContacts = [];
    snapshot.forEach(function (childSnapshot) {
      let contact = childSnapshot.val();
      allContacts.push(contact);

      contactsListContent.innerHTML += /*html*/ `
          <div>
              <div id="initial-letter">A</div>
              <div id="breakline-contactlist"></div>
              <div
                onclick="showContactInfo('${contact.email}');showContactResponsive();"
                class="flex-align-center"
                id="contact-contactlist"
              >
                <div class="first-letters-name-contactlist-bg">
                  <span class="first-letters-name-contactlist">AM</span>
                </div>
                <div id="contact-name-email-contactlist">
                  <span id="contact-name-contactlist">${contact.name}</span>
                  <span id="email-contactlist">${contact.email}</span>
                </div>
              </div>
            </div>
            `;
    });
  });
}


// function init() {
//   // document.getElementById("add-new-contact-popUp-bg").classList.add("d-none");
//   // document.getElementById("edit-contact-popUp-bg").classList.add("d-none");
//   // document.getElementById("PopUp-edit-delete-bg").classList.add("display-none");
// }


// function addNewContactPopUp() {
//   document
//     .getElementById("add-new-contact-popUp-bg")
//     .classList.add("translateX-null");
// }


// function closePupUpaddNewOrEdditContact() {
//   document
//     .getElementById("add-new-contact-popUp-bg")
//     .classList.remove("translateX-null");
//   document
//     .getElementById("edit-contact-popUp-bg")
//     .classList.remove("translateX-null");
// }


// function editContactPopUp() {
//   document
//     // .getElementById("edit-contact-popUp-bg")
//     // .classList.add("add-new-or-edit-contact-popUp-bg");
//   document.getElementById("edit-contact-popUp-bg").classList.add("translateX-null");
// }

// function showContactInfo() {
//   document.getElementById("contact").classList.add("translateX-null");
// }

// function showContactResponsive() {
//   let width = window.innerWidth;
//   if (width <= 1050) {
//     document.getElementById("contacts-list").classList.add("display-none");
//     document.getElementById("contacts-container-responsive").classList.add("d-unset");
//     document.getElementById("back-icon").classList.add("d-unset");

//   }
// }

// function closeContact() {
//   document.getElementById("contacts-list").classList.remove("display-none");
//   document.getElementById("contacts-container-responsive").classList.remove("d-unset");
//   document.getElementById("back-icon").classList.remove("d-unset");
// }

// function closePopUpEditDelete() {
//   document.getElementById("PopUp-edit-delete-bg").classList.add("display-none");
// }

// function openPopUpEditDelete() {
//   document.getElementById("PopUp-edit-delete-bg").classList.remove("display-none");
// }