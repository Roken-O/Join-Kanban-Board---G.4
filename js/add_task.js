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