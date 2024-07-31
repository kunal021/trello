"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

type Props = {
  children: ReactNode;
};

const PublicRoute = ({ children }: Props) => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/home");
    }
  }, [token, router]);

  if (token) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default PublicRoute;
