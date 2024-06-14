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

function saveTask() {
    let title = document.getElementById("task-trial-title").value;
    let description = document.getElementById("task-trial-description").value;

    let task = {
        "title": title,
        "description": description
    };

    document.getElementById("task-trial-title").value = "";
    document.getElementById("task-trial-description").value = "";
    
    let database = firebase.database();
    let newTask = database.ref("tasks").push();

    newTask.set(task);
}

// set actual date-function
//         function getDate() {
//   var today = new Date();
//   var dd = today.getDate();
//   var mm = today.getMonth()+1; //January is 0!
//   var yyyy = today.getFullYear();

//   if(dd<10) {
//       dd = '0'+dd
//   } 

//   if(mm<10) {
//       mm = '0'+mm
//   } 

//   today = yyyy + '/' + mm + '/' + dd;
//   console.log(today);
//   document.getElementById("date").value = today;
// }


// window.onload = function() {
//   getDate();
// };
    