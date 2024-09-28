"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Loading from "loading.tsx";

interface AuthWrapperProps {
    children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <Loading />;
    }

    return <>{children}</>;
};

export default AuthWrapper;
