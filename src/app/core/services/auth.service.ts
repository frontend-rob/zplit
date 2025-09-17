import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

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

    constructor(private environmentInjector: EnvironmentInjector) { }

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
}
