"use client";
import React, { useEffect, useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { auth } from "../firebase";
import VerifyEmail from "../components/VerifyEmail";
import { useRouter } from "next/navigation";
import Loading from "../loading/page";


export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [newuser, setNewuser] = useState(false);
    const [verified, setVerified] = useState<undefined | boolean>(false);
    const router = useRouter()

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setVerified(user?.emailVerified);
        });
    }, [auth]);
    
    return (
        <>
        {verified === false ? 
            <VerifyEmail />
        : verified === undefined ? 
        newuser ? (
            <Register
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                setLoading={setLoading}
                setNewuser={setNewuser}
            />
        ) : (
            <Login
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                setLoading={setLoading}
                setNewuser={setNewuser}
            />
        ): 
        (router.push('/'), <Loading />)}
        </>
    )
     
}
