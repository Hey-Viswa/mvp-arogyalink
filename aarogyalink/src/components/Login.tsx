"use client";

import EmailPasswordSignIn from "./auth/EmailPasswordSignIn";
import GoogleSignIn from "./auth/GoogleSignIn";
import PhoneSignIn from "./auth/PhoneSignIn";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-lg sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 md:text-3xl">
          Sign in to your account
        </h2>
        <div className="mt-6">
          <EmailPasswordSignIn />
        </div>

        {/* Or divider */}
        <div className="flex items-center justify-center mt-6">
          <div className="w-full border-t border-gray-300"></div>
          <div className="px-4 text-sm text-gray-500">Or</div>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        {/* Social Logins */}
        <div className="mt-6 space-y-4">
          <GoogleSignIn />
          <PhoneSignIn />
        </div>
      </div>
    </div>
  );
};

export default Login;
