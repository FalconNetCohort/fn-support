"use client";
import React, { useState } from 'react';
import LogIn from "@/app/components/LogIn"; // adjust the path accordingly
import SignUp from "@/app/components/SignUp"; // adjust the path accordingly

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);

    return (

        <div className="auth-global">
            <div>{isSignUp ? <SignUp/> : <LogIn/>}</div>
            <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-blue-500 hover:underline">
                {isSignUp ? 'Already have an account? Log In' : 'Don’t have an account? Sign Up' }
            </button>
        </div>
    );
}
