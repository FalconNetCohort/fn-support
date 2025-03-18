"use client";
import React, {Suspense, useState} from 'react';
import LogIn from "@/app/components/LogIn"; // adjust the path accordingly
import SignUp from "@/app/components/SignUp";
import Header from "@/app/components/Header";
import AuthWrapper from "@/app/components/AuthWrapper";
import Loading from "@/app/loading/page"; // adjust the path accordingly

function AuthContent() {
    const [isSignUp, setIsSignUp] = useState(false);

    return (

        <AuthWrapper>
            <Header />
            <div className="text-black bg-gray-900 flex flex-col items-center justify-center min-h-screen font-MyriadPro font-semibold">
                <div>{isSignUp ? <SignUp/> : <LogIn/>}</div>
                <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-blue-500 hover:underline">
                    {isSignUp ? 'Already have an account? Log In' : 'Don’t have an account? Sign Up' }
                </button>
            </div>
        </AuthWrapper>
    );
}

const Auth = () => {
    return (
        <Suspense fallback={<Loading />}>
            <AuthContent />
        </Suspense>
    );
};

export default Auth;