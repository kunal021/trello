"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!token) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(checkAuth, 100);

    return () => clearTimeout(timeoutId);
  }, [token, router]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
