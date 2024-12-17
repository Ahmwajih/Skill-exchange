"use client";
import React, { useState, useEffect } from 'react';
import SkillCardDetails from '@/app/components/SkillCardDetails';
import Protect from "@/app/components/Protect"; 
import loading2 from "@/app/public/loading2.gif";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from 'next/image';


function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center bg-white items-center h-screen">
        <Image src={loading2} alt="Loading..." width={250} height={250} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center bg-white items-center h-screen">
        <p className="text-red-500">An error occurred: {error.message}</p>
      </div>
    );
  }

  return (
    <Protect>
      <Navbar />
      <ErrorBoundary setError={setError}>
        <SkillCardDetails />
      </ErrorBoundary>
      <Footer />
    </Protect>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.props.setError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center bg-white items-center h-screen">
          <p className="text-red-500">Something went wrong.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default Page;