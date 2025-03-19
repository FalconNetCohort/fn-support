"use client";
import React, { Suspense, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from "@/app/firebase";
import Loading from "@/app/loading/page";
import AuthWrapper from "@/app/components/AuthWrapper";
import Header from "@/app/components/Header";
import Link from "next/link";

function ForgotPasswordContent() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useRouter();

    function hasAFAcademy(inputString: string) {
        return inputString.endsWith("@afacademy.af.edu");
    }

    const sendResetEmail = async () => {
        setErrorMessage('');
        setMessage('');

        if (!hasAFAcademy(email)) {
            setErrorMessage("Invalid email. Please enter a valid AF Academy email.");
            return;
        }

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("An email has been sent to your email address. Please check your inbox to reset your password.");
        } catch (error: any) {
            console.error("Error sending password reset email:", error.message);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrapper>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-black font-MyriadPro font-semibold">
                <div className="p-8 w-96">
                    <h1 className="text-3xl font-bold text-center mb-4 text-white">Forgot Password</h1>

                    {errorMessage && <div className="text-red-500 text-sm mb-2 text-center">{errorMessage}</div>}
                    {message && <div className="text-green-500 text-sm mb-2 text-center">{message}</div>}

                    <form onSubmit={(e) => { e.preventDefault(); sendResetEmail(); }} className="w-full">
                        <input
                            type="email"
                            placeholder="Enter your AFA Academy email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />

                        <button
                            disabled={isLoading}
                            type="submit"
                            className={`w-full p-3 text-white font-bold rounded-lg shadow-md transition duration-300 ${
                                isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 hover:shadow-xl transform hover:scale-105"
                            }`}
                        >
                            {isLoading ? "Sending..." : "Send Reset Email"}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <Link href="/auth" className="text-indigo-500 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
}

const ForgotPassword = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ForgotPasswordContent />
        </Suspense>
    );
};

export default ForgotPassword;
