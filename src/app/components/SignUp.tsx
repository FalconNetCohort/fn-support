"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {createUserWithEmailAndPassword, getAuth, sendEmailVerification, signOut} from 'firebase/auth';
import '../firebase.js'; // adjust the path accordingly

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
    const auth = getAuth();
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if(hasAFAcademy(email)){
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                // After creation of the user, send the user a verification email.
                if(userCredential.user) {
                    await sendEmailVerification(userCredential.user);
                    setVerificationMessage("Account created successfully! Please check your email to verify your account.");
                    // Sign the user out
                    await signOut(auth);
                    // set flag in localStorage
                    localStorage.setItem('showEmailVerificationMessage', 'true');
                    await router.push('/auth');  // Redirect to login page after successful account creation
                }
            }

            if (!hasAFAcademy(email)){
                console.error("Use AF Academy Email");
                setError("Use AF Academy Email");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error during authentication:", error.message);
                setError(error.message);
            }
        }
    }

    return (
        <div className="auth-form">
            <h1 className="text-2xl mb-4">Sign up for FalconShop</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleAuth} className="w-64">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 p-2 border rounded shadow-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 p-2 border rounded shadow-lg"
                />
                <p style={{color: 'red', textAlign: 'center'}} className="mt-0 mb-4 p-2">Do not use your Office 365 Microsoft Password!</p>
                <button type="submit" className="auth-btn">
                    Create FalconShop account
                </button>
            </form>
            {verificationMessage && <p className="text-green-500">{verificationMessage}</p>}
        </div>
    );
}

function hasAFAcademy(inputString: String) {
    return inputString.endsWith("@afacademy.af.edu");
}