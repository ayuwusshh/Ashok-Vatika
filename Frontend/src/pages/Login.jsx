import React from 'react';
import { Leaf } from 'lucide-react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-brand-background">
      <div className="mb-8 text-center">
        <div className="bg-brand-primary/10 p-3 rounded-2xl inline-block mb-4">
          <Leaf className="h-8 w-8 text-brand-primary" />
        </div>
        <h1 className="text-3xl font-display font-bold text-brand-primary">Welcome Back</h1>
        <p className="text-brand-on-surface-variant mt-2">Log in to track your learning progress.</p>
      </div>
      
      <div className="w-full max-w-md flex justify-center">
        <SignIn routing="path" path="/login" signUpUrl="/signup" />
      </div>
    </div>
  );
};

export default Login;
