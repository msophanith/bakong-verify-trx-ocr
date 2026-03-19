"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  readonly onCapture: (file: File) => void;
  readonly onClose: () => void;
}

export default function LiveScannerModal({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Camera access error:", err);
        setError(
          "Camera access denied. Please check your browser permissions.",
        );
      }
    };

    startCamera();
    return stopCamera;
  }, [stopCamera]);

  const capture = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!videoRef.current) {
        setError("Camera reference not found.");
        return;
      }

      const { videoWidth, videoHeight } = videoRef.current;
      if (!videoWidth || !videoHeight) {
        setError("Camera feed not ready yet or loading. Please wait a moment.");
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Failed to create image canvas.");
        return;
      }

      try {
        // Draw current video frame to canvas
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Use synchronous toDataURL which is fully reliable on older mobile WebViews
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

        const arr = dataUrl.split(",");
        const match = arr[0].match(/:(.*?);/);
        const mime = match ? match[1] : "image/jpeg";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        const blob = new Blob([u8arr], { type: mime });

        let file: File;
        try {
          file = new File([blob], "scanned_receipt.jpg", {
            type: mime,
          });
        } catch (err) {
          console.warn(
            "New File constructor not supported, falling back to Blob mutation",
            err,
          );
          const fallback = blob as unknown as File;
          try {
            Object.defineProperty(fallback, "name", {
              value: "scanned_receipt.jpg",
            });
            Object.defineProperty(fallback, "lastModified", {
              value: Date.now(),
            });
          } catch (definePropertyErr) {
            console.warn("Could not mutate Blob properties", definePropertyErr);
          }
          file = fallback;
        }

        stopCamera();
        onCapture(file);
      } catch (err) {
        console.error(err);
        setError("Failed to process image from camera. Please try again.");
      }
    },
    [onCapture, stopCamera],
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
      <style>{`
        @keyframes scanline {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scanline {
          animation: scanline 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Header */}
      <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <h2 className="text-white font-semibold text-lg drop-shadow-md">
          Scan Receipt
        </h2>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-400">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      ) : (
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Scanner Overlay UI */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <mask id="scan-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x="10%"
                    y="15%"
                    width="80%"
                    height="60%"
                    rx="16"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="black"
                fillOpacity="0.6"
                mask="url(#scan-mask)"
              />
              {/* Outer stroke of the box */}
              <rect
                x="10%"
                y="15%"
                width="80%"
                height="60%"
                rx="16"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.2"
              />
            </svg>

            {/* Scanning Box Details */}
            <div className="absolute top-[15%] left-[10%] w-[80%] h-[60%] pointer-events-none">
              {/* Corners */}
              <div className="absolute -top-[2px] -left-[2px] w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-[16px]"></div>
              <div className="absolute -top-[2px] -right-[2px] w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-[16px]"></div>
              <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-[16px]"></div>
              <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8 border-b-4 border-r-4 border-white rounded-br-[16px]"></div>

              {/* Animated line */}
              <div className="absolute left-0 right-0 h-0.5 bg-green-400 shadow-[0_0_12px_3px_rgba(74,222,128,0.6)] animate-scanline z-20"></div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-sm font-medium tracking-wide">
                Center receipt details here
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 inset-x-0 flex items-center justify-center pb-safe z-20">
            <button
              onClick={capture}
              className="group relative w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1 bg-black/20 backdrop-blur-md"
            >
              <div className="w-full h-full bg-white rounded-full group-active:scale-90 transition-transform duration-200 shadow-[0_0_20px_rgba(255,255,255,0.4)]"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
