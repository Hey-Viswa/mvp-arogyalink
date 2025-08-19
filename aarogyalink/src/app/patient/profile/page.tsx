"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import Link from "next/link";
import ClientOnly from "@/components/ClientOnly";

const PatientProfile = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
    // A simple role check could be added here if needed, but for now, we assume if they land here, they are a patient.
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg">Loading...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-xl font-bold text-indigo-600">AarogyaLink</h1>
                    <Link href="/patient/dashboard" className="text-indigo-600 hover:underline">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </nav>
        <main className="container mx-auto p-4 mt-6 flex flex-col items-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Your QR Code</h2>
                <p className="text-center text-gray-600">
                    Your doctor can scan this code to access your medical records.
                </p>
                <div className="p-4 bg-white rounded-lg flex justify-center h-[288px] w-[288px]">
                    {/* The QR code is wrapped in ClientOnly to prevent hydration errors */}
                    <ClientOnly>
                        <QRCode value={user.uid} size={256} />
                    </ClientOnly>
                </div>
                <p className="text-center text-sm text-gray-500">
                    <strong>User ID:</strong> {user.uid}
                </p>
            </div>
        </main>
    </div>
  );
};

export default PatientProfile;
