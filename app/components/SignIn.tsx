'use client';
import Logo from '../public/Logo.svg';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import Home from '../pages/Home';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
  
    try {
      const response = await fetch('api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      console.log('Response:', response);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred.');
      }
  
      const data = await response.json();
  
      if (data.success) {
        console.log('User logged in successfully:', data);
        router.push('/home');
      } else {
        alert(data.message || 'Sign-in failed.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('An error occurred. Please try again.');
    }
  };
  

  const handleProviderSignIn = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await sendTokenToServer(token);
      router.push('/');
    } catch (error) {
      console.error(`Error signing in with provider:`, error);
      alert(error.message);
    }
  };

  const sendTokenToServer = async (token) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send token to server');
      }
    } catch (error) {
      console.error('Error sending token to server:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-white shadow-lg rounded-lg">
        <div className="card-body p-6">
          <figure className="flex justify-center mb-6">
            <Image src={Logo} alt="Logo" width={63} height={63} className="rounded-lg" />       
               </figure>
          <h2 className="card-title text-center text-2xl font-bold text-gray-700 mb-6">Join our community</h2>
          <form onSubmit={handleSignIn}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium text-gray-600">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered w-full border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium text-gray-600">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btnSignin w-full mb-4">Sign In</button>
          </form>
          <div className="divider text-gray-500">OR</div>
          <div className="flex flex-col space-y-3">
            <button
              className="btn btn-outline w-full text-gray-700"
              onClick={() => handleProviderSignIn(googleProvider)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-5 w-5 mr-2">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
              </svg>
              Sign in with Google
            </button>
            <button
              className="btn btn-outline w-full text-gray-700"
              onClick={() => handleProviderSignIn(githubProvider)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="h-5 w-5 mr-2">
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-1.6-.7-3.6-.4-4.3.7zm34.9 36.4c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.3-2.3-5.2-2.6-6.5-1z"/>
              </svg>
              Sign in with GitHub
            </button>
          </div>
          <p className="text-center text-gray-500 mt-6">
            Don't have an account? <Link href="/register" className="text-blue-600">Register here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
