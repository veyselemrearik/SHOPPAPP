
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCg3ysJ6JzZjqeB32sv-C36OSzGODZTfJ4",
    authDomain: "shopapp-a1d8f.firebaseapp.com",
    databaseURL: "https://shopapp-a1d8f-default-rtdb.firebaseio.com",
    projectId: "shopapp-a1d8f",
    storageBucket: "shopapp-a1d8f.appspot.com",
    messagingSenderId: "1072246438797",
    appId: "1:1072246438797:web:9b1e6aef2a5eba40189bc4"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(app);
export default storage;