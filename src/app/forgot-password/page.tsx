"use client";
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useRouter();
  const sendResetEmail = async () => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "An email has been sent to your email address. Please click the link in that email to reset your password."
      );
    } catch (error: any) {
      console.error("Error sending password reset email:", error.message);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl mb-4">Forgot password</h1>
      {errorMessage && (
        <div className="alert alert-danger text-red-500">{errorMessage}</div>
      )}
      {message && (
        <div className="alert alert-success text-green-500">{message}</div>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border rounded w-64"
      />
      <button
        disabled={isLoading}
        onClick={sendResetEmail}
        className="w-64 p-2 bg-blue-600 text-white rounded mb-4"
      >
        Send password reset email
      </button>
    </div>
  );
}
