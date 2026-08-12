import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { UserProfile } from './types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD36EeEiv-cnFJ0jgCStcu6XElxyD0HY64",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gems-journal.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gems-journal",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gems-journal.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "379553209619",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:379553209619:web:27318c940c302707ce8ee6",
  measurementId: "G-79CEG1WSYM"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function checkFirebaseRedirectResult(): Promise<UserProfile | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const fbUser = result.user;
      return {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google Trader',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
        isLoggedIn: true,
        role: 'trader',
      };
    }
  } catch (error) {
    console.error('Firebase Redirect Result Error:', error);
  }
  return null;
}

export async function signInWithGoogleFirebase(): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    // Try Popup first
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    return {
      user: {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google Trader',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
        isLoggedIn: true,
        role: 'trader',
      }
    };
  } catch (error: any) {
    console.error('Firebase Google Sign-In Error:', error);
    if (error.code === 'auth/popup-closed-by-user') {
      return { user: null };
    }
    if (error.code === 'auth/network-request-failed' || error.code === 'auth/popup-blocked') {
      // Fall back to clean browser redirect which avoids third-party cookie/iframe network blocks
      try {
        await signInWithRedirect(auth, googleProvider);
        return { user: null };
      } catch (redirectErr: any) {
        return { user: null, error: `[Firebase Redirect Error]: ${redirectErr.message}` };
      }
    }
    return { 
      user: null, 
      error: `[Firebase Error ${error.code || 'UNKNOWN'}]: ${error.message}` 
    };
  }
}

export async function signOutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase SignOut error:', err);
  }
}

export { onAuthStateChanged };
