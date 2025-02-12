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
                    router.push('/auth');  // Redirect to login page after successful account creation
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
        <div className="w-full max-w-sm flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl mb-4">Sign up for FalconSupport</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleAuth} className="w-92">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 p-2 border rounded shadow-lg text-black"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 p-2 border rounded shadow-lg text-black"
                />
                <p style={{color: 'red', textAlign: 'center'}} className="mt-0 mb-4 p-2">Do not use your Office 365 Microsoft Password!</p>
                <button type="submit" className="w-full mb-3 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105">
                    Create account
                </button>
            </form>
            {verificationMessage && <p className="text-green-500">{verificationMessage}</p>}
        </div>
    );
}

function hasAFAcademy(inputString: String) {
    return inputString.endsWith("@afacademy.af.edu");
}