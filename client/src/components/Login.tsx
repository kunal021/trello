"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PublicRoute from "./PublicRoute";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://trello-wzb3.onrender.com/api/auth/login",
        data
      );

      if (response.status === 201) {
        sessionStorage.setItem(
          "trello_user",
          JSON.stringify(response.data.data.user)
        );
        sessionStorage.setItem(
          "trello_token",
          JSON.stringify(response.data.data.token)
        );
        toast.success("Logged in successfully");
        window.location.href = "/home";
      }
    } catch (error: string | any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <PublicRoute>
      <Card className="w-96 mb-44">
        <CardHeader>
          <CardTitle className="text-center">
            Welcome to <span className="text-indigo-700">Workflo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={data.email}
            onChange={handleChange}
            name="email"
            placeholder="Your Email"
            type="email"
            className="focus-visible:ring-indigo-500 bg-gray-100"
          />
          <Input
            value={data.password}
            onChange={handleChange}
            name="password"
            placeholder="Password"
            type="password"
            className="focus-visible:ring-indigo-500 bg-gray-100"
          />
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-t from-indigo-900 to-indigo-700 hover:bg-gradient-to-t hover:from-indigo-900 hover:to-indigo-700"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs mx-auto">
            Don&apos; have an account? Create a{" "}
            <Link href="/sign-up" className="text-indigo-700">
              new account
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </PublicRoute>
  );
}

export default Login;
