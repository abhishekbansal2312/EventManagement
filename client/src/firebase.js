// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Include if analytics is needed
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGtLfFuK-ZA2IUxqXUWCMrrUBcLj5GHMA",
  authDomain: "event-management-a7e51.firebaseapp.com",
  projectId: "event-management-a7e51",
  storageBucket: "event-management-a7e51.appspot.com",
  messagingSenderId: "265201626574",
  appId: "1:265201626574:web:58fdd4f034e8123cc40f9f",
  measurementId: "G-7WEE6W8CDD"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app); // Include if analytics is needed
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Initialize Firestore and Storage
const firestore = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize storage

// Export the storage and firestore objects
export { storage, firestore }; // Export storage and firestore for use in other files
