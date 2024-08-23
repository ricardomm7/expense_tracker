// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCndfXc1pUpG1e7A625RjBsc-2hdFsEL0I",
  authDomain: "testweb-95236.firebaseapp.com",
  projectId: "testweb-95236",
  storageBucket: "testweb-95236.appspot.com",
  messagingSenderId: "93131895720",
  appId: "1:93131895720:web:f7abdb04401380197ca39d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
