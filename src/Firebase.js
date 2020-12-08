import firebase from "firebase";


const firebaseConfig = {
    apiKey: "AIzaSyABLFfX1y8qY4DIEh9COnC2P7fHGsChxMA",
    authDomain: "whatsappclone-24467.firebaseapp.com",
    projectId: "whatsappclone-24467",
    storageBucket: "whatsappclone-24467.appspot.com",
    messagingSenderId: "551124537857",
    appId: "1:551124537857:web:225ae98ffa24dfeaf6e600",
    measurementId: "G-ZDM12831PY"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;