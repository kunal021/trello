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
import PublicRoute from "./PublicRoute";
import { useRouter } from "next/navigation";

function Signup() {
  const [data, setData] = useState({
    name: "",
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
        "http://localhost:3050/api/auth/signup",
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
        toast.success("User created successfully");
        router.push("/home");
        router.refresh();
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
      <Card className="w-96 mb-40">
        <CardHeader>
          <CardTitle className="text-center">
            Welcome to <span className="text-indigo-700">Workflo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={data.name}
            onChange={handleChange}
            name="name"
            placeholder="Your Fullname"
            type="text"
            className="focus-visible:ring-indigo-500 bg-gray-100"
          />
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
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs mx-auto">
            Already have an account?{" "}
            <Link href="/" className="text-indigo-700">
              Log In
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </PublicRoute>
  );
}

export default Signup;
