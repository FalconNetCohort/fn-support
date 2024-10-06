import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmail() {
    const router = useRouter();
    const [reloading, setReloading] = useState(false);
    const [resending, setResending] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut(auth);
        setSigningOut(false);
        router.push("/login");
    };

    const handleReload = async () => {
        setReloading(true);
        await auth.currentUser?.reload();
        setReloading(false);
        if (auth.currentUser?.emailVerified) {
            router.back();
        }
    };

    const handleResendEmail = async () => {
        setResending(true);
        try {
            await sendEmailVerification(auth.currentUser as any);
            alert("Verification email sent!");
        } catch (error: unknown) {
            if (error && typeof error === "object" && "message" in error) {
                alert(error.message);
            }
        }
        setResending(false);
    }


    return (
        <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 bg-gray-900 text-white">
            <EnvelopeOpenIcon className="absolute w-48 h-48 text-blue-500 opacity-20" />
            <h1 className="text-4xl font-bold mb-4 z-10">Verify Email</h1>
            <p className="text-center z-10">
                Please verify&nbsp;
                <span className="font-bold">{auth.currentUser?.email}</span>
                &nbsp;to continue.
            </p>
            <div className="flex space-x-8 mt-6 items-center justify-center z-10">
                <button
                onClick={handleReload}
                className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md ${reloading ? "opacity-50" : ""}`}
                >
                {reloading ? "Reloading..." : "Reload"}
                </button>
                <button
                onClick={handleResendEmail}
                className={`p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md ${resending ? "opacity-50" : ""}`}
                >
                {resending ? "Resending..." : "Resend Email"}
                </button>
                <button
                onClick={handleSignOut}
                className={`p-2 bg-red-500 hover:bg-red-600 text-white rounded-md ${signingOut ? "opacity-50" : ""}`}
                >
                {signingOut ? "Signing Out..." : "Sign Out"}
                </button>
            </div>
        </main>
    )
}