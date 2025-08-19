"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

import FileUpload from "@/components/FileUpload";
import DocumentList from "@/components/DocumentList";

const PatientDashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const checkRole = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().role === "patient") {
        setIsAuthorized(true);
      } else {
        router.push("/");
      }
    };

    checkRole();
  }, [user, loading, router]);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
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
                    <h1 className="text-xl font-bold text-indigo-600">AarogyaLink</h1>
                    <div>
                        <span className="text-gray-800 mr-4">Welcome, {user?.email}</span>
                        <button onClick={() => router.push('/patient/profile')} className="text-indigo-600 hover:underline">Profile</button>
                    </div>
                </div>
            </div>
        </nav>
        <main className="container mx-auto p-4 mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Patient Dashboard</h2>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <DocumentList refreshTrigger={refreshTrigger} />
        </main>
    </div>
  );
};

export default PatientDashboard;
