import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

const firebaseConfig = {
 
  databaseURL: 'https://knowlege-quran-4ccb0.firebaseio.com',
  apiKey: "AIzaSyCbcyreKBvJ1mKxrjCjORshTLXEnpf8Eyc",
  authDomain: "knowlege-quran-4ccb0.firebaseapp.com",
  projectId: "knowlege-quran-4ccb0",
  storageBucket: "knowlege-quran-4ccb0.appspot.com",
  messagingSenderId: "999993120612",
  appId: "1:999993120612:web:84a1612713efc9c52c0c71"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { app, db, auth };
