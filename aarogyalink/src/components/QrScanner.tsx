"use client";

import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QrScannerProps {
    onScanSuccess: (decodedText: string) => void;
}

const QrScanner = ({ onScanSuccess }: QrScannerProps) => {
    useEffect(() => {
        // To prevent multiple instances of the scanner
        if (document.getElementById('qr-reader')?.innerHTML) {
            return;
        }

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                // Important: We want to remember the last used camera
                rememberLastUsedCamera: true,
            },
            /* verbose= */ false
        );

        const handleSuccess = (decodedText: string) => {
            // Stop scanning after a successful scan
            scanner.clear();
            onScanSuccess(decodedText);
        };

        const handleError = () => {
            // We can ignore most errors, as they happen frequently (e.g., no QR code in view)
        };

        scanner.render(handleSuccess, handleError);

        return () => {
            // Cleanup function to clear the scanner when the component unmounts
            if (scanner && scanner.getState() === 2) { // 2 is SCANNING state
                 scanner.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode-scanner.", error);
                });
            }
        };
    }, [onScanSuccess]);

    return <div id="qr-reader" className="w-full md:w-1/2 lg:w-1/3 mx-auto"></div>;
};

export default QrScanner;
