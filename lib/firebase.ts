// lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDtiRFLDUErXZ3jHBqzhmJu8Yzo_LefI44",
  authDomain: "skillexchange-35492.firebaseapp.com",
  projectId: "skillexchange-35492",
  storageBucket: "skillexchange-35492.appspot.com",
  messagingSenderId: "250514866295",
  appId: "G-K5TXN6WNWB"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider(); 