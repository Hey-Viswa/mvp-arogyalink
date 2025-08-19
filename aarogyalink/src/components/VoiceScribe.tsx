"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const parsePrescription = (text: string): PrescriptionItem[] => {
    // This is a naive parser for demonstration purposes. A more robust solution would use NLP or more complex regex.
    const items: PrescriptionItem[] = [];
    const textItems = text.split(/and|,/i); // Split by 'and' or ','

    textItems.forEach(itemText => {
        itemText = itemText.trim();
        if (!itemText) return;

        let medication = itemText;
        let dosage = '';
        let frequency = '';
        let duration = '';

        // Extract duration
        const durationMatch = itemText.match(/for\s(.*?)(?=\s(once|twice|daily|three times)|$)/i);
        if (durationMatch) {
            duration = durationMatch[1].trim();
            medication = medication.replace(durationMatch[0], '').trim();
        }

        // Extract frequency
        const frequencyMatch = itemText.match(/(once a day|twice a day|daily|three times a day)/i);
        if (frequencyMatch) {
            frequency = frequencyMatch[1].trim();
            medication = medication.replace(frequencyMatch[0], '').trim();
        }

        // Extract dosage
        const dosageMatch = itemText.match(/(\d+\s?mg|\d+\s?ml)/i);
        if (dosageMatch) {
            dosage = dosageMatch[0].trim();
            medication = medication.replace(dosageMatch[0], '').trim();
        }

        items.push({
            medication: medication.trim(),
            dosage,
            frequency,
            duration
        });
    });

    return items.filter(item => item.medication); // Only return items with a medication name
};


const VoiceScribe = ({ patientId }: { patientId: string }) => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedItems, setParsedItems] = useState<PrescriptionItem[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(transcript + finalTranscript + interimTranscript);
        if (finalTranscript) {
             setParsedItems(parsePrescription(transcript + finalTranscript));
        }
      };
    }
  }, [transcript]);

  const handleListen = () => {
    const recognition = recognitionRef.current;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSavePrescription = async () => {
    if (!user || parsedItems.length === 0) return;

    try {
        await addDoc(collection(db, "prescriptions"), {
            patientId: patientId,
            doctorId: user.uid,
            items: parsedItems,
            originalTranscript: transcript,
            createdAt: serverTimestamp(),
        });
        // Reset state after saving
        setTranscript("");
        setParsedItems([]);
        alert("Prescription saved successfully!");
    } catch (error) {
        console.error("Error saving prescription: ", error);
        alert("Failed to save prescription.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">VoiceScribe - New Prescription</h2>
      <div className="mb-4">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onBlur={() => setParsedItems(parsePrescription(transcript))}
          className="w-full h-32 p-2 border border-gray-300 rounded-md"
          placeholder="Speak or type prescription details here... e.g., 'Paracetamol 500mg twice a day for 3 days and Amoxicillin 250mg three times a day for 5 days'"
        />
      </div>
      <button
        onClick={handleListen}
        className={`px-4 py-2 rounded-md text-white font-semibold ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>

      {parsedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Parsed Prescription</h3>
          <ul className="list-disc pl-5 space-y-2">
            {parsedItems.map((item, index) => (
              <li key={index}>
                <strong>Medication:</strong> {item.medication}<br />
                {item.dosage && <><strong>Dosage:</strong> {item.dosage}<br /></>}
                {item.frequency && <><strong>Frequency:</strong> {item.frequency}<br /></>}
                {item.duration && <><strong>Duration:</strong> {item.duration}</>}
              </li>
            ))}
          </ul>
          <button
            onClick={handleSavePrescription}
            className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            Save Prescription
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceScribe;
