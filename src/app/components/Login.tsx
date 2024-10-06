"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Header from "./Header";

interface Props {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setNewuser: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({email, setEmail, password, setPassword, loading, setLoading, setNewuser} : Props) {
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.back();
        } catch (error: unknown) {
            if (error && typeof error === "object" && "message" in error){
                setError(error.message as string);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 bg-gray-900 text-white">
                <h1 className="text-3xl mb-6">Login</h1>
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
                        <a onClick={() => setNewuser(true)} className="text-blue-500 hover:underline hover:cursor-pointer">
                            Create Account
                        </a>
                        </span>
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline ${loading ? 'opacity-50' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}
