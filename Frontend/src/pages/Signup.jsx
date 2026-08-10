import React from 'react';
import { Leaf } from 'lucide-react';
import { SignUp } from '@clerk/clerk-react';

const Signup = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-brand-background">
      <div className="mb-8 text-center">
        <div className="bg-brand-primary/10 p-3 rounded-2xl inline-block mb-4">
          <Leaf className="h-8 w-8 text-brand-primary" />
        </div>
        <h1 className="text-3xl font-display font-bold text-brand-primary">Join Ashok Vatika</h1>
        <p className="text-brand-on-surface-variant mt-2">Create an account to start your botanical journey.</p>
      </div>
      
      <div className="w-full max-w-md flex justify-center">
        <SignUp routing="path" path="/signup" signInUrl="/login" />
      </div>
    </div>
  );
};

export default Signup;
