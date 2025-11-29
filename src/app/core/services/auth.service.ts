import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { 
    Auth,
    createUserWithEmailAndPassword,
    UserCredential,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    user as firebaseUser 
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/**
 * Represents user data stored in Firestore.
 */
export interface UserData {
    uid: string;
    userName: string;
    email: string;
}

/**
 * AuthService provides methods for user registration and authentication.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    /**
     * Observable for the current user.
     */
    user$: Observable<import('@angular/fire/auth').User | null>;

    /**
     * Creates an instance of AuthService.
     * @param environmentInjector The Angular EnvironmentInjector
     */
    constructor(private environmentInjector: EnvironmentInjector) {
        this.user$ = runInInjectionContext(this.environmentInjector, () => {
            const auth = inject(Auth);
            return firebaseUser(auth);
        });
    }

    /**
     * Registers a new user with email and password using Firebase Authentication.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns A promise resolving to the UserCredential object.
     */
    async registerUser(email: string, password: string): Promise<UserCredential> {
        return runInInjectionContext(this.environmentInjector, async () => {
            const auth = inject(Auth);
            return await createUserWithEmailAndPassword(auth, email, password);
        });
    }

    /**
     * Saves user data to Firestore.
     * @param uid - The user's UID.
     * @param userData - The user data to store.
     * @returns A promise that resolves when the data is saved.
     */
    async saveUserToFirestore(uid: string, userData: UserData): Promise<void> {
        return runInInjectionContext(this.environmentInjector, async () => {
            const firestore = inject(Firestore);
            const userRef = doc(firestore, `users/${uid}`);
            await setDoc(userRef, userData);
        });
    }

    /**
     * Logs in a user with Firebase Authentication.
     * Ensures the method runs within an Angular injection context.
     * @param email - The email address of the user.
     * @param password - The password for the user.
     * @returns A promise that resolves when the user is successfully logged in.
     */
    async logIn(email: string, password: string): Promise<void> {
        return runInInjectionContext(this.environmentInjector, async () => {
            const auth = inject(Auth);
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
        });
    }

    /**
     * Signs in the user using Google OAuth via a popup and ensures a Firestore
     * user document exists for the authenticated user.
     * @returns Promise<void> - resolves when the operation is complete.
     */
    async signInWithGoogle(): Promise<void> {
        return runInInjectionContext(this.environmentInjector, async () => {
            const auth = inject(Auth);
            const firestore = inject(Firestore);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const user = result.user;
            const userRef = doc(firestore, `users/${user.uid}`);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await this.saveUserToFirestore(user.uid, {
                    uid: user.uid,
                    userName: user.displayName ?? '',
                    email: user.email ?? ''
                });
            }
        });
    }

    /**
     * Logs out the currently authenticated user.
     * @returns Promise<void> - resolves when sign-out is complete.
     */
    async logOut(): Promise<void> {
        return runInInjectionContext(this.environmentInjector, async () => {
            const auth = inject(Auth);
            await signOut(auth);
        });
    }

    /**
     * Reads user data from Firestore.
     * @param uid - The user's UID.
     * @returns Promise<UserData | null> - resolves with stored user data or null if not found.
     */
    async getUserDataFromFirestore(uid: string): Promise<UserData | null> {
        return runInInjectionContext(this.environmentInjector, async () => {
            const firestore = inject(Firestore);
            const userRef = doc(firestore, `users/${uid}`);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) return null;
            return userSnap.data() as UserData;
        });
    }

}
