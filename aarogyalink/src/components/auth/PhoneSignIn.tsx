"use client";

import { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";
import { handleUserRedirect } from "./authHelpers";

const PhoneSignIn = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
    });
  }, []);

  const handlePhoneSignIn = async () => {
    setError("");
    try {
      const verifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, `+${phone}`, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleOtpSubmit = async () => {
    setError("");
    if (!confirmationResult) {
      setError("Please send OTP first.");
      return;
    }
    try {
      const userCredential = await confirmationResult.confirm(otp);
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
    <div className="space-y-4">
      <div id="recaptcha-container"></div>
      {!otpSent ? (
        <>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handlePhoneSignIn}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleOtpSubmit}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Verify OTP
          </button>
        </>
      )}
      {error && <p className="mt-2 text-sm text-center text-red-600">{error}</p>}
    </div>
  );
};

export default PhoneSignIn;
