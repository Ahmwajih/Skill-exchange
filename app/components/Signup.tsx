"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import {register} from "@/lib/features/auth/authSlice";
import { useDispatch } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import { AppDispatch } from "@/lib/store";

export default function SignIn() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  
  const dispatch = useDispatch();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    if (password !== retypePassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await dispatch(register({name, email, password }, router));
      console.log("user registered successfully");
      router.push("/signin");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("register failed. Please try again.");
    }

  };

  const handleProviderSignIn = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User logged in successfully:", result.user);
      router.push("/main");
    } catch (error) {
      console.error(`Error signing in with provider:`, error);
      alert(error.message);
    }
  };

  return (
    <section className="flex flex-col items-center min-h-screen bg-white py-4 px-4 sm:px-8">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/d53f44d0b4930bc2c267dce9c30b2f4116e32dc1b203ed76d08054d5180281f8?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
        alt=""
        className="object-contain mt-3 aspect-square w-[63px]"
      />
      <h2 className="mt-6 text-3xl font-bold leading-none text-center text-slate-800">
        Join our community
      </h2>
      <form
        className="flex flex-col mt-12 w-full max-w-[358px] max-md:mt-10"
        onSubmit={handleSignIn}
      >
        <div className="flex flex-col w-full">
          <label htmlFor="name" className="font-medium text-slate-700">
            Name*
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full bg-white rounded-lg border border-gray-300 border-solid shadow-sm min-h-[46px] text-slate-800"
            placeholder="Please enter your name"
          />
        </div>
        <div className="flex flex-col mt-6 w-full">
          <label htmlFor="email" className="font-medium text-slate-700">
            Email*
          </label>
          <input
            type="email"
            id="email"
            className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full bg-white rounded-lg border border-gray-300 border-solid shadow-sm min-h-[46px] text-slate-800"
            placeholder="Please enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mt-6 w-full">
          <label htmlFor="password" className="font-medium text-slate-700">
            Password*
          </label>
          <input
            type="password"
            id="password"
            className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full bg-white rounded-lg border border-gray-300 border-solid shadow-sm min-h-[46px] text-slate-800"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mt-6 w-full">
          <label htmlFor="retype-password" className="font-medium text-slate-700">
            Retype Password*
          </label>
          <input
            type="password"
            id="retype-password"
            className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full bg-white rounded-lg border border-gray-300 border-solid shadow-sm min-h-[46px] text-slate-800"
            placeholder="************"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2 mt-4 w-full text-xs font-medium">
          <div className="flex justify-between items-center text-gray-700">
            <label className="label cursor-pointer flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="checkbox checkbox-primary shrink-0 w-4 h-4 bg-white rounded border border-black border-solid shadow-sm"
              />
              <span className="mx-2">Remember me</span>
            </label>
            <a href="#" className="text-right text-gray-700">
              Forgot your password?
            </a>
          </div>
        </div>
        <button
          type="submit"
          className="self-stretch px-5 py-3 mt-6 text-base font-medium text-white bg-blue rounded-md shadow-md w-full"
        >
          Sign Up
        </button>
        <button
          type="button"
          className="flex gap-2 justify-center items-center px-5 py-3 mt-4 text-base font-medium bg-white rounded-md border border-gray-100 shadow-sm w-full"
          onClick={() => handleProviderSignIn(googleProvider)}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/58367ad1684e90ebb46e6dd71e7e80b32aae98a0e06ff83bd5b63b2393586283?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
            alt="Google logo"
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
          <span>Sign in with Google</span>
        </button>
        <button
          type="button"
          className="flex gap-2 justify-center items-center px-5 py-2.5 mt-4 text-base font-medium bg-white rounded-md border border-gray-100 shadow-sm w-full"
          onClick={() => handleProviderSignIn(githubProvider)}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8173a5b673a4c6a8ab511addf3a1048b5d1d836e91ca4b2ae36cb42a81bc96c6?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
            alt="GitHub logo"
            className="object-contain shrink-0 self-stretch my-auto aspect-[1.04] w-[27px]"
          />
          <span>Sign in with Github</span>
        </button>
      </form>
      <p className="mt-4 text-xs font-medium leading-5 text-center text-blue-400">
        Already have an account?{" "}
        <a href="/signin" className="text-blue-400">
          Sign In
        </a>
      </p>
    </section>
  );
}