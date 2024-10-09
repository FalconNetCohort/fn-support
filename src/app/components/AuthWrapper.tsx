import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "@/app/loading/page";
import {auth} from "@/app/firebase";

interface AuthWrapperProps {
    children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (!user) {
            router.push("/auth");
        }
    }, [user, loading, router]);

    if (loading) {
        return <Loading />;
    }

    return <>{children}</>;
};

export default AuthWrapper;
