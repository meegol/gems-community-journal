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

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

function mapFirebaseUser(fbUser: any): UserProfile {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Trader',
    email: fbUser.email || '',
    avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
    isLoggedIn: true,
    role: 'trader',
  };
}

/**
 * Primary sign-in: tries popup first (works great on localhost).
 * If the popup is blocked or fails with a network/CORS error,
 * automatically falls back to redirect-based sign-in.
 */
export async function signInWithGoogleFirebase(): Promise<{ user: UserProfile | null; redirecting?: boolean; error?: string }> {
  try {
    // Try popup first
    const result = await signInWithPopup(auth, googleProvider);
    return { user: mapFirebaseUser(result.user) };
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      // User deliberately closed the popup — no action
      return { user: null };
    }

    // For network errors, popup blocked, or CORS issues — fall back to redirect
    if (
      error.code === 'auth/network-request-failed' ||
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/operation-not-supported-in-this-environment' ||
      error.code === 'auth/internal-error'
    ) {
      console.warn('Popup failed, falling back to redirect sign-in:', error.code);
      await signInWithRedirect(auth, googleProvider);
      // signInWithRedirect navigates away — the result will be handled on next page load
      return { user: null, redirecting: true };
    }

    console.error('Firebase Google Sign-In Error:', error);
    return { 
      user: null, 
      error: `Sign-in failed: ${error.message || error.code}` 
    };
  }
}

/**
 * Call this once on app mount to pick up the result of a redirect sign-in.
 * Returns the user if a redirect sign-in just completed, otherwise null.
 */
export async function handleFirebaseRedirectResult(): Promise<UserProfile | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return mapFirebaseUser(result.user);
    }
    return null;
  } catch (error: any) {
    console.error('Firebase redirect result error:', error);
    return null;
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
