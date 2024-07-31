"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>{children}</AuthProvider>
      </Provider>
      <Toaster />
    </>
  );
};

export default ClientProviders;
