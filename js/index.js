/**
 * @type {Array<Object>}
 * Array to hold all user objects retrieved from the database.
 */
let allUsers = [];

/**
 * @type {number}
 * State of click actions for toggling password visibility.
 */
let clickState = 0;

/**
 * Initializes the index page by loading users, animating elements, checking inputs, and setting user status to false.
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initIndex() {
  await checkLoadUsers();
  animate();
  checkInputs();
  usersSettoFalse();
}

/**
 * Loads user data from the Firebase database and updates the `allUsers` array.
 * @returns {Promise<void>} A promise that resolves when the users are loaded.
 */
function loadUsers() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      /**
       * @type {firebase.database.Database}
       * Reference to the Firebase database.
       */
      let database = firebase.database();
      /**
       * @type {firebase.database.Reference}
       * Reference to the 'users' node in the Firebase database.
       */
      let usersEntries = database.ref('users');
      usersEntries.on(
        'value',
        function (snapshot) {
          allUsers = [];
          snapshot.forEach(function (childSnapshot) {
            /**
             * @type {Object}
             * Represents a user object with properties including email, password, and name.
             */
            let user = childSnapshot.val();
            user.id = childSnapshot.key;
            allUsers.push(user);
          });
          resolve();
        },
        () => {
          reject('hat nicht geklappt!');
        }
      );
    }, 10);
  });
}

/**
 * Checks if users are loaded and saves user data to local storage.
 * @returns {Promise<void>} A promise that resolves when the users are checked and saved.
 */
async function checkLoadUsers() {
  await loadUsers();
  saveLocalStorage();
}

/**
 * Clears input fields and populates them with saved credentials from local storage if available.
 */
function checkInputs() {
  /**
   * @type {HTMLInputElement | null}
   * Input element for email.
   */
  let emailInput = document.getElementById('email');

  /**
   * @type {HTMLInputElement | null}
   * Input element for password.
   */
  let passwordInput = document.getElementById('password');

  emailInput.value = '';
  passwordInput.value = '';
  /**
   * @type {string | null}
   * Email saved in local storage.
   */
  let rememberedEmail = localStorage.getItem('rememberedEmail');
  /**
   * @type {string | null}
   * Password saved in local storage.
   */
  let rememberedPassword = localStorage.getItem('rememberedPassword');
  if (rememberedEmail) {
    document.getElementById('email').value = rememberedEmail;
    document.getElementById('password').value = rememberedPassword;
    document.getElementById('rememberMe').checked = true;
  }
}

/**
 * Handles user signup by validating input values and adding new users.
 */
async function signup() {
  /**
   * @type {string}
   * Username input value.
   */
  let nameSignup = document.getElementById('username').value;
  /**
   * @type {string}
   * Email input value for signup.
   */
  let emailSignup = document.getElementById('email-signup').value;
  /**
   * @type {string}
   * Password input value for signup.
   */
  let passwordSignup = document.getElementById('password-signup').value;
  /**
   * @type {string}
   * Confirm password input value for signup.
   */
  let confirmPasswordSignup = document.getElementById('confirmPassword-signup').value;
  if (passwordSignup != confirmPasswordSignup) {
    checkPassword();
  } else {
    /**
     * @type {Object | undefined}
     * The user object if a user with the same email is found in `allUsers`.
     */
    const checkUser = allUsers.find((user) => user.email === emailSignup);
    if (checkUser) {
      checkEmailSignupFunk(checkUser['email']);
    } else {
      checkPasswordLength(passwordSignup, emailSignup, passwordSignup, nameSignup);
    }
  }
}

/**
 * Checks the length of the password and proceeds with user signup if valid.
 * @param {string} passwordSignup - The signup password.
 * @param {string} emailSignup - The signup email.
 * @param {string} password - The signup password.
 * @param {string} nameSignup - The signup username.
 */
function checkPasswordLength(passwordSignup, emailSignup, passwordSignup, nameSignup) {
  if (passwordSignup.length > 5) {
    showMessageAlert();
    setTimeout(() => {
      allUsers.push({ email: emailSignup, password: passwordSignup, name: nameSignup });
      saveNewUser(emailSignup, passwordSignup, nameSignup);
      checkLoadUsers();
      saveLocalStorage();
      window.location.href = 'index.html';
    }, 2250);
  } else {
    document.getElementById('wrong-password').innerHTML = `Password must be at least 6 characters!`;
    document.getElementById('wrong-password').style.display = passwordSignup.length <= 5 ? 'flex' : 'none';
  }
}

/**
 * Displays an error message if the email is already used.
 * @param {string} checkEmail - The email to compare with.
 */
function checkEmailSignupFunk(checkEmail) {
  /**
   * @type {string}
   * Email input value for signup.
   */
  let emailSignup = document.getElementById('email-signup').value;
  document.getElementById('existing-email').style.display = emailSignup == checkEmail ? 'flex' : 'none';
}

/**
 * Displays an error message if passwords do not match.
 */
function checkPassword() {
  /**
   * @type {string}
   * Password input value for signup.
   */
  let passwordSignup = document.getElementById('password-signup').value;
  /**
   * @type {string}
   * Confirm password input value for signup.
   */
  let confirmPasswordSignup = document.getElementById('confirmPassword-signup').value;
  document.getElementById('wrong-password').style.display = passwordSignup != confirmPasswordSignup ? 'flex' : 'none';
}

/**
 * Saves a new user to the Firebase database and updates the local storage.
 * @param {string} emailSignup - The email of the new user.
 * @param {string} passwordSignup - The password of the new user.
 * @param {string} nameSignup - The name of the new user.
 */
function saveNewUser(emailSignup, passwordSignup, nameSignup) {
  /**
   * @type {string}
   * Initials derived from the user's name.
   */
  let initialName = getInitials(nameSignup);
  /**
   * @type {Object}
   * Represents the new user to be saved.
   */
  let user = {
    email: emailSignup,
    password: passwordSignup,
    name: nameSignup,
    initial: initialName,
    registered: false,
  };
  /**
   * @type {firebase.database.Database}
   * Reference to the Firebase database.
   */
  let database = firebase.database();
  /**
   * @type {number}
   * Number of users currently in the `allUsers` array.
   */
  let usersLength = allUsers.length;
  /**
   * @type {firebase.database.Reference}
   * Reference to the specific user entry in the Firebase database.
   */
  let userEntry = database.ref('users/' + usersLength);
  userEntry.set(user);
}

/**
 * Generates initials from a given name.
 * @param {string} string - The name from which to generate initials.
 * @returns {string} The initials derived from the name.
 */
let getInitials = function (string) {
  /**
   * @type {string[]}
   * Array of name parts split by space.
   */
  let name = string.split(' '),
    initials = name[0].substring(0, 1).toUpperCase();
  if (name.length > 1) {
    initials += name[name.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

/**
 * Shows an alert message and animates it.
 */
function showMessageAlert() {
  document.getElementById('alertMessage').style.display = 'flex';
  /**
   * @type {HTMLElement | null}
   * DOM element for the alert message container.
   */
  let alertMessage = document.getElementById('popup-message');
  setTimeout(() => {
    alertMessage.classList.add('animate-popup-message');
    setTimeout(() => {
      alertMessage.classList.remove('animate-popup-message');
      document.getElementById('alertMessage').style.display = 'none';
    }, 2000);
  }, 250);
}

/**
 * Handles user login by validating credentials and redirecting to the summary page if successful.
 * @param {Event} event - The event object from the form submission.
 */
function login(event) {
  event.preventDefault();
  document.getElementById('wrong-email').classList.add('d-none');
  document.getElementById('wrong-password-login').style.display = 'none';
  /**
   * @type {HTMLInputElement | null}
   * Input element for email.
   */
  let email = document.getElementById('email');
  /**
   * @type {HTMLInputElement | null}
   * Input element for password.
   */
  let password = document.getElementById('password');
  /**
   * @type {boolean}
   * Whether the 'Remember Me' checkbox is checked.
   */
  let rememberMe = document.getElementById('rememberMe').checked;
  /**
   * @type {Object | undefined}
   * The user object if a user with the same email is found in `allUsers`.
   */
  let user = allUsers.find((u) => u.email == email.value);
  if (user) {
    if (user['password'] == password.value) {
      /**
       * @type {string}
       * ID of the logged-in user.
       */
      let userID = user['id'];
      userRegisterd(userID);
      saveRememberMe(rememberMe, email, password);
      window.location.href = 'summary.html';
    } else {
      checkPasswordLogin(user['password'], password.value);
      document.getElementById('password').value = '';
    }
  } else {
    document.getElementById('wrong-email').classList.remove('d-none');
  }
}

/**
 * Saves or removes remembered credentials in local storage based on the 'Remember Me' option.
 * @param {boolean} rememberMe - Whether the 'Remember Me' checkbox is checked.
 * @param {HTMLInputElement} email - The email input element.
 * @param {HTMLInputElement} password - The password input element.
 */
function saveRememberMe() {
  if (rememberMe) {
    localStorage.setItem('rememberedEmail', email.value);
    localStorage.setItem('rememberedPassword', password.value);
  } else {
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
  }
}

/**
 * Updates the 'registered' status for users in the Firebase database.
 * @param {string} userID - The ID of the currently logged-in user.
 */
function userRegisterd(userID) {
  /**
   * @type {firebase.database.Database}
   * Reference to the Firebase database.
   */
  let database = firebase.database();
  for (let i = 0; i < allUsers.length; i++) {
    /**
     * @type {string}
     * ID of a user.
     */
    let notLogged = allUsers[i]['id'];
    if (userID != notLogged) {
      /**
       * @type {firebase.database.Reference}
       * Reference to the 'registered' field of a user in the Firebase database.
       */
      let userEntry = database.ref('users/' + notLogged + '/registered/');
      userEntry.set(false);
      saveLocalStorage();
    }
  }
  /**
   * @type {firebase.database.Reference}
   * Reference to the 'registered' field of the currently logged-in user.
   */
  let userEntry = database.ref('users/' + userID + '/registered/');
  userEntry.set(true);
}

/**
 * Displays an error message if the login password is incorrect.
 * @param {string} userPassword - The correct password for the user.
 * @param {string} loginPassword - The entered password for login.
 */
function checkPasswordLogin(userPassword, loginPassword) {
  document.getElementById('wrong-password-login').style.display = userPassword == loginPassword ? 'none' : 'flex';
}

/**
 * Toggles the visibility of the password input field between 'password' and 'text'.
 * @param {string} password - The ID of the password input field.
 */
function togglePasswordVisibility(password) {
  /**
   * @type {HTMLInputElement | null}
   * Password input element.
   */
  let passwordInput = document.getElementById(password);
  if (clickState > 0) {
    passwordInput.type = passwordInput.type == 'password' ? 'text' : 'password';
  }
  clickState++;
}

/**
 * Sets demo credentials and navigates to the summary page.
 */
function goToSummarySite() {
  /**
   * @type {HTMLInputElement | null}
   * Input element for email.
   */
  let email = document.getElementById('email');
  /**
   * @type {HTMLInputElement | null}
   * Input element for password.
   */
  let password = document.getElementById('password');
  email.value = 'guest@gmail.com';
  password.value = '123456';
  /**
   * @type {Object | undefined}
   * The user object if a user with the demo email is found in `allUsers`.
   */
  let user = allUsers.find((u) => u.email == email.value);
  /**
   * @type {string}
   * ID of the demo user.
   */
  let userID = user['id'];
  userRegisterd(userID);
  window.location.href = 'summary.html';
}

/**
 * Animates elements on the index page based on screen width.
 */
function animate() {
  if (window.innerWidth > 550) {
    setTimeout(() => {
      /**
       * @type {HTMLElement | null}
       * DOM element for the logo container.
       */
      document.getElementById('logo-container').classList.add('animate');
      /**
       * @type {HTMLElement | null}
       * DOM element for the login site container.
       */
      document.getElementById('login-site').classList.add('animate-login-site');
      setTimeout(() => {
        setOpacitySignupAndLogin();
      }, 500);
    }, 500);
  } else {
    /**
     * @type {HTMLImageElement | null}
     * DOM element for the logo image.
     */
    document.getElementById('logo').src = './assets/img/join_logo_WHT.svg';
    setTimeout(() => {
      document.getElementById('logo-container').classList.add('animate');
      document.getElementById('login-site').classList.add('animate-login-site');
      setTimeout(() => {
        setOpacitySignupAndLogin();
        document.getElementById('logo').src = './assets/img/join_logo_DARK.svg';
      }, 500);
    }, 500);
  }
}

/**
 * Sets the opacity of signup and login containers.
 */
function setOpacitySignupAndLogin() {
  /**
   * @type {HTMLElement | null}
   * DOM element for the signup container.
   */
  document.getElementById('signUp-Container').style.opacity = '1';
  /**
   * @type {HTMLElement | null}
   * DOM element for the login container.
   */
  document.getElementById('login-container').style.opacity = '1';
  /**
   * @type {HTMLElement | null}
   * DOM element for the imprint container.
   */
  document.getElementById('imprint-container').style.opacity = '1';
}

/**
 * Displays the login site and hides the signup site.
 */
function goToLoginSite() {
  /**
   * @type {HTMLElement | null}
   * DOM element for the signup container.
   */
  document.getElementById('signUp-Container').style.opacity = '1';
  /**
   * @type {HTMLElement | null}
   * DOM element for the login container.
   */
  document.getElementById('login-container').style.display = 'flex';
  /**
   * @type {HTMLElement | null}
   * DOM element for the signup site container.
   */
  document.getElementById('signup-site-container').style.display = 'none';
}

/**
 * Displays the signup site and hides the login site.
 */
function goToSignupSite() {
  /**
   * @type {HTMLElement | null}
   * DOM element for the signup container.
   */
  document.getElementById('signUp-Container').style.opacity = '0';
  /**
   * @type {HTMLElement | null}
   * DOM element for the login container.
   */
  document.getElementById('login-container').style.display = 'none';
  /**
   * @type {HTMLElement | null}
   * DOM element for the signup site container.
   */
  document.getElementById('signup-site-container').style.display = 'flex';
  /**
   * @type {HTMLElement | null}
   * DOM element for the signup site container.
   */
  let signupSite = document.getElementById('signup-site-container');
  signupSite.style.opacity = '1';
  signupSite.innerHTML = getSignupSite();
}

/**
 * Sets all users in the database to 'registered: false'.
 * This function is used to set the registration status of all users to false.
 */
async function usersSettoFalse() {
  /**
   * @type {firebase.database.Database}
   * Reference to the Firebase database.
   */
  let database = firebase.database();
  for (let i = 0; i < allUsers.length; i++) {
    /**
     * @type {string}
     * ID of a user.
     */
    let registeredID = allUsers[i]['id'];
    /**
     * @type {firebase.database.Reference}
     * Reference to the 'registered' field of a user in the Firebase database.
     */
    let userEntry = database.ref('users/' + registeredID + '/registered/');
    await userEntry.set(false);
  }
  saveLocalStorage();
}
