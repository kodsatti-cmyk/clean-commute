"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRGeneratorProps {
  url: string;
  location: {
    id: string;
    name: string;
  };
}

export default function QRGenerator({ url, location }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("QR generation error:", error);
        }
      );

      // Generate download URL
      QRCode.toDataURL(
        url,
        {
          width: 800,
          margin: 2,
        },
        (error, dataUrl) => {
          if (!error) {
            setDownloadUrl(dataUrl);
          }
        }
      );
    }
  }, [url]);

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.download = `qr-${location.id}.png`;
      link.href = downloadUrl;
      link.click();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && downloadUrl) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - ${location.name}</title>
            <style>
              @media print {
                @page { margin: 2cm; }
                body { 
                  margin: 0; 
                  display: flex; 
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                }
              }
              body {
                font-family: Arial, sans-serif;
                text-align: center;
              }
              h1 {
                font-size: 2.5em;
                margin-bottom: 0.5em;
                color: #16a34a;
              }
              p {
                font-size: 1.5em;
                margin-bottom: 1em;
                color: #4b5563;
              }
              img {
                max-width: 500px;
                height: auto;
              }
            </style>
          </head>
          <body>
            <h1>Clean Commute Challenge</h1>
            <p>${location.name}</p>
            <img src="${downloadUrl}" alt="QR Code for ${location.name}" />
            <p style="font-size: 1.2em; margin-top: 1em;">
              Scan to log your sustainable commute
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 print:shadow-none">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        {location.name}
      </h3>

      <div className="flex justify-center mb-4">
        <canvas ref={canvasRef} className="border-4 border-gray-200 rounded-lg" />
      </div>

      <div className="text-sm text-gray-600 mb-4 break-all text-center">
        {url}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Download PNG
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Print
        </button>
      </div>
    </div>
  );
}
