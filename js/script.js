// W3SCHOOLS INCLUDE HTML TEMPLATE SCRIPT - START

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





