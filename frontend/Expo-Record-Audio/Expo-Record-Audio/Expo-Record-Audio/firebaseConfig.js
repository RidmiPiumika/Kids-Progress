import firebase from "firebase/compat/app";
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/database';  

const firebaseConfig = {
    apiKey: "AIzaSyDWePpAw3TrccgmwJwx4C1A8cL7DTSj3PU",
    authDomain: "downladfile.firebaseapp.com",
    projectId: "downladfile",
    storageBucket: "downladfile.appspot.com",
    messagingSenderId: "832672344244",
    appId: "1:832672344244:web:11e8a90840bee87a238fe1",
    measurementId: "G-YF9B7991JY",
    databaseURL: "https://downladfile-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();
const database = firebase.database();

export { firebase, storage, database };