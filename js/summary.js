let registeredUserName;
let registeredUserInitials;
let registeredID;

document.addEventListener('DOMContentLoaded', function () {
    initSummary();
});

async function initSummary() {
    includeHTML();
    await loadUsers();
    loadLocalStorage();
    checkTrueRegistered();
     getInitialsName();
    showGreeting();
    greetAnimate();
    urgentDate();
}

function showGreeting() {
    let hours = new Date().getHours();
    let greeting = document.getElementById('greeting');
    let topGreeting = document.getElementById('top-greeting');
    let greetingName = document.getElementById('greeting-name');
    let greetingNameTop = document.getElementById('greeting-name-top');
    if (registeredUserName) {
        greetingName.innerHTML = greetingNameTop.innerHTML = registeredUserName;
    } else {
        greetingName.innerHTML = greetingNameTop.innerHTML = '';
    }
    if (hours >= 6 && hours < 12) {
        greeting.innerHTML = topGreeting.innerHTML = 'Good Morning';
    } else if (hours >= 12 && hours < 18) {
        greeting.innerHTML = topGreeting.innerHTML = 'Good Afternoon';
    } else {
        greeting.innerHTML = topGreeting.innerHTML = 'Good Evening';
    }
}

function checkTrueRegistered() {
    for (let index = 0; index < allUsers.length; index++) {
        let user = allUsers[index];
        if (user['registered'] == true) {
            registeredUserName = user['name'];
            registeredID = user['id'];
            registeredUserInitials = user['initial'];
            break;
        }
    }
}

function loadUsers() {
    let database = firebase.database();
    let usersEntries = database.ref("users");
    usersEntries.on("value", function (snapshot) {
        allUsers = [];
        snapshot.forEach(function (childSnapshot) {
            let user = childSnapshot.val();
            user.id = childSnapshot.key;
            allUsers.push(user);
        });
    });
}

function greetAnimate() {
    if (window.innerWidth < 1100) {
        setTimeout(() => {
            let leftMainContainer = document.getElementById('left-main-container');
            let greet = document.getElementById('greet');

            leftMainContainer.style.opacity = '0';
            greet.style.opacity = '1';
            greet.style.display = 'flex';
            setTimeout(() => {
                leftMainContainer.style.opacity = '1';
                greet.style.display = 'none';
                greet.style.opacity = '0';
            }, 1500);
        }, 10);
    }
}

function changeSvgColor(path) {
    document.getElementById(path).classList.add('cls-4');
}

function resetSvgColor(path) {
    document.getElementById(path).classList.remove('cls-4');
}

function urgentDate() {
    let months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    let urgentDate = new Date();
    urgentDate.setDate(urgentDate.getDate() + 4);

    let year = urgentDate.getFullYear();
    let month = months[urgentDate.getMonth()];
    let day = urgentDate.getDate();
    let upcomingDate = `${month} ${day}, ${year}`;
    document.getElementById('urgent-date').innerHTML = upcomingDate;
}

// let getInitials = function (string) {
//     let name = string.split(" "),
//       initials = name[0].substring(0, 1).toUpperCase();

//     if (name.length > 1) {
//       initials += name[name.length - 1].substring(0, 1).toUpperCase();
//     }
//     return initials;
//   };


function toggleShowLogout() {
    let logoutContainer = document.getElementById('showLogout');
    logoutContainer.innerHTML = `
     <div class="popout-showlogout">
        <a href="privacy.html">Legal Notice</a>
        <a href="privacy.html">Privacy Policy</a>
        <a onclick="logout('${registeredID}')" href="#">Log Out</a>
      </div>`;
    if (logoutContainer.style.display == 'flex') {
        logoutContainer.style.display = 'none';
    } else {
        logoutContainer.style.display = 'flex';
    }
}

function getInitialsName() {
  if (registeredUserInitials) {
      document.getElementById('sub-contact-initial-container').innerHTML = registeredUserInitials;
  }
}

function logout(registeredID) {

    let database = firebase.database();
  
    if (registeredID) {
        let userEntry = database.ref("users/" + registeredID + "/registered/");
        userEntry.set(false);
        loadUsers();
        saveLocalStorage();
    }
    window.location.href = 'index.html';
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


