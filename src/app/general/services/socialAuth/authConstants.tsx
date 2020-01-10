import firebase from 'firebase'


// Replace with your configuration from firebase developer console like below
var config = {
    apiKey: "AIzaSyDjsVyXLkx0JIbbA8nVVEtvysvQ-2Iwrzg",
    authDomain: "demo.firebaseapp.com",
    databaseURL: "https://demo.firebaseio.com",
    projectId: "demo",
    storageBucket: "demo.appspot.com",
    messagingSenderId: "750198706866"
  };

firebase.initializeApp(config);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;