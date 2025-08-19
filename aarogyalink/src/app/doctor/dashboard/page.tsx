"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import QrScanner from "@/components/QrScanner";

const DoctorDashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const checkRole = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().role === "doctor") {
        setIsAuthorized(true);
      } else {
        router.push("/");
      }
    };

    checkRole();
  }, [user, loading, router]);

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    // The decoded text should be the patient's UID
    router.push(`/doctor/patient/${decodedText}`);
  };

  if (loading || !isAuthorized) {
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
                    <h1 className="text-xl font-bold text-indigo-600">AarogyaLink - Doctor Portal</h1>
                    <span className="text-gray-800">Welcome, Dr. {user?.email}</span>
                </div>
            </div>
        </nav>
        <main className="container mx-auto p-4 mt-6 flex flex-col items-center">
             <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Scan Patient QR Code</h2>
                {scanResult ? (
                    <p className="text-center text-green-600">Scan successful! Redirecting...</p>
                ) : (
                    <QrScanner onScanSuccess={handleScanSuccess} />
                )}
             </div>
        </main>
    </div>
  );
};

export default DoctorDashboard;
