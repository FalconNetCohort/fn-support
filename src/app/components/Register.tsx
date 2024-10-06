"use client";
import React from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";

interface Props {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setNewuser: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Register({email, setEmail, password, setPassword, loading, setLoading, setNewuser} : Props) {
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if(!email.endsWith("@afacademy.af.edu")){
            setError("Please use your @afacademy.af.edu email address.");
            setLoading(false);
            return;
        } else {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
            } catch (error: unknown) {
                if (error && typeof error === "object" && "message" in error){
                    setError(error.message as string);
                }
            } finally {
                setLoading(false);
                auth.currentUser && sendEmailVerification(auth.currentUser);
            }
        }
    };

    return (
        <>
            <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 bg-gray-900 text-white">
                <h1 className="text-3xl mb-6">Create Account</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            pattern="[a-zA-Z0-9._%+-]+@afacademy\.af\.edu"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 -mt-2 mb-2 text-xs">{error}</div>}
                    <div className="flex align-middle">
                        <span className="flex-1 py-2">
                        <a onClick={() => setNewuser(false)} className="text-blue-500 hover:underline hover:cursor-pointer">
                            Already registered?
                        </a>
                        </span>
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline ${loading ? "opacity-50" : ""}`}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}
