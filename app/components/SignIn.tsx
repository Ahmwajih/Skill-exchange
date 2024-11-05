import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

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
      const response = await fetch('/api/login', {
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
        router.push('/');
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
      console.log('User logged in successfully:', result.user);
      router.push('/');
    } catch (error) {
      console.error(`Error signing in with provider:`, error);
      alert(error.message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-white shadow-lg rounded-lg">
        <div className="card-body p-6">
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
              Sign in with Google
            </button>
            <button
              className="btn btn-outline w-full text-gray-700"
              onClick={() => handleProviderSignIn(githubProvider)}
            >
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}