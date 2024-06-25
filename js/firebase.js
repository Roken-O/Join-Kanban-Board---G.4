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
  let database = firebase.database();