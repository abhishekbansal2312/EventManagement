// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Include if analytics is needed
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
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
