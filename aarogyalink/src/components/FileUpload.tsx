"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebase";

const FileUpload = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      // Basic validation for file type
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        setError("Invalid file type. Please upload a PDF, JPG, or PNG.");
        setFile(null);
        return;
      }
      setError("");
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    setError("");

    try {
      // Create a storage reference
      const storageRef = ref(storage, `documents/${user.uid}/${file.name}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Add document metadata to Firestore
      await addDoc(collection(db, "documents"), {
        patientId: user.uid,
        fileName: file.name,
        fileUrl: downloadURL,
        createdAt: serverTimestamp(),
      });

      setFile(null);
      onUploadSuccess(); // Callback to refresh the document list
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Failed to upload file: " + err.message);
      } else {
        setError("An unexpected error occurred during file upload.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 my-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Upload New Document</h3>
      <div className="mt-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-4">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
