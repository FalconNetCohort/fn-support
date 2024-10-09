"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import '../firebase.js';

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const auth = getAuth();
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem('showEmailVerificationMessage')) {
            setErrorMessage('Please check your email and verify your account before logging in.');
            localStorage.removeItem('showEmailVerificationMessage');
        }
    }, []);

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                if (!userCredential.user.emailVerified) {
                    setErrorMessage("Please verify your email before logging in.");
                    return;
                } else {
                    await router.push('/');
                }
            }
        } catch (error: any) {
            console.error("Error during authentication:", error.message);
            setErrorMessage(error.message);
        }
    }

    return (
        <div className="auth-form">
            <h1 className="text-3xl mb-4">Login</h1>
            {errorMessage && <div className="alert alert-danger text-red-500">{errorMessage}</div>}
            <form onSubmit={handleAuth} className="w-64">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-2 p-2 border rounded w-64"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-2 p-2 border rounded w-64"
                />
                <p style={{color: 'red', textAlign: 'center'}} className="mt-0 mb-4 p-2">Do not use your Office 365
                    Microsoft Password!</p>
                <button type="submit" className="auth-btn">
                    Log In
                </button>
            </form>

            <Link href="/forgot-password" className="text-indigo-500 hover:underline">
                Forgot password?
            </Link>
        </div>
    );
}