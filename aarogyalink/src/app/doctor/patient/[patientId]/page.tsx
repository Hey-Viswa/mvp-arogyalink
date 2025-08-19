"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import VoiceScribe from "@/components/VoiceScribe";

interface Patient {
    uid: string;
    email: string;
    role: string;
}

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: any;
}

const PatientRecordPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch patient details
    const fetchPatientDetails = async () => {
      const docRef = doc(db, "users", patientId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPatient(docSnap.data() as Patient);
      } else {
        // Handle case where patient doesn't exist
        console.error("No such patient!");
      }
    };

    if (patientId) {
      fetchPatientDetails();

      // Subscribe to patient documents
      const q = query(
        collection(db, "documents"),
        where("patientId", "==", patientId),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Document[];
        setDocuments(docs);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, authLoading, router, patientId]);

  if (loading || authLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg">Loading Patient Records...</p>
        </div>
    );
  }

  if (!patient) {
      return (
          <div className="flex flex-col justify-center items-center min-h-screen">
              <p className="text-lg text-red-500">Could not find patient data.</p>
              <Link href="/doctor/dashboard" className="mt-4 text-indigo-600 hover:underline">
                Return to Dashboard
              </Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-xl font-bold text-indigo-600">AarogyaLink - Doctor Portal</h1>
                    <Link href="/doctor/dashboard" className="text-indigo-600 hover:underline">
                        Back to Scanner
                    </Link>
                </div>
            </div>
        </nav>
        <main className="container mx-auto p-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Patient Details</h2>
                        <p><strong>Email:</strong> {patient.email}</p>
                        <p><strong>Patient ID:</strong> {patient.uid}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Uploaded Documents</h3>
                        {documents.length > 0 ? (
                             <ul className="space-y-2">
                                {documents.map((doc) => (
                                    <li key={doc.id} className="p-2 border-b border-gray-200">
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:underline"
                                        >
                                            {doc.fileName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No documents found for this patient.</p>
                        )}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <VoiceScribe patientId={patientId} />
                </div>
            </div>
        </main>
    </div>
  );
};

export default PatientRecordPage;
