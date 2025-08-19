"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: Timestamp;
}

const DocumentList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, "documents"),
      where("patientId", "==", user.uid),
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
  }, [user, refreshTrigger]);

  if (loading) {
    return <p>Loading documents...</p>;
  }

  if (documents.length === 0) {
    return <p>No documents uploaded yet.</p>;
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Your Documents</h3>
        <ul className="mt-4 space-y-2">
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
    </div>
  );
};

export default DocumentList;
