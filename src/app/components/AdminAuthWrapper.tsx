import { ReactNode, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "@/app/loading/page";
import { auth } from "@/app/firebase";

interface AuthWrapperProps {
  children: ReactNode;
}

const AdminAuthWrapper = ({ children }: AuthWrapperProps) => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!auth) {
      router.push("/auth");
    }
    user?.getIdTokenResult().then((idTokenResult) => {
      if (idTokenResult.claims?.admin !== true) {
        router.push("/");
      }
    });
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;
