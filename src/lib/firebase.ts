import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
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
 * Redirect-only Google sign-in. No popup. Navigates the user to Google,
 * then back to the app. Call handleFirebaseRedirectResult() on page load
 * to pick up the result.
 */
export async function signInWithGoogleFirebase(): Promise<{ redirecting: true }> {
  await signInWithRedirect(auth, googleProvider);
  return { redirecting: true };
}

/**
 * Call once on app mount. If the user just came back from a Google redirect
 * sign-in, this returns their profile. Otherwise returns null.
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
