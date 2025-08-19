"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";
import { handleUserRedirect } from "./authHelpers";

const GoogleSignIn = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await handleUserRedirect(userCredential.user, router);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <button
        onClick={handleGoogleSignIn}
        className="w-full px-4 py-2 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign in with Google
      </button>
      {error && <p className="mt-2 text-sm text-center text-red-600">{error}</p>}
    </>
  );
};

export default GoogleSignIn;
