"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Team, campaignConfig } from "@/data";
import Image from "next/image";

interface FinalPreviewProps {
  croppedImageUrl: string;
  selectedTeam: Team;
}

export default function FinalPreview({
  croppedImageUrl,
  selectedTeam,
}: FinalPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    setIsDownloading(true);

    try {
      // Create a temporary container with the exact size we want
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "512px";
      tempContainer.style.height = "512px";
      tempContainer.style.backgroundColor = "white";

      // Clone the preview content
      const previewClone = previewRef.current.cloneNode(true) as HTMLElement;
      previewClone.style.width = "512px";
      previewClone.style.height = "512px";
      previewClone.style.position = "relative";

      tempContainer.appendChild(previewClone);
      document.body.appendChild(tempContainer);

      // Wait for images to load
      const images = tempContainer.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve(null);
            } else {
              img.onload = () => resolve(null);
              img.onerror = () => resolve(null);
            }
          });
        })
      );

      // Generate the image
      const canvas = await html2canvas(tempContainer, {
        width: 512,
        height: 512,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Clean up
      document.body.removeChild(tempContainer);

      // Download the image
      const link = document.createElement("a");
      link.download = `${selectedTeam.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-profile-picture.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Error generating download:", error);
      alert(
        "Sorry, there was an error generating your image. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {campaignConfig.instructions.finalReady}
      </h2>

      <div className="space-y-6">
        {/* Final Preview */}
        <div className="text-center">
          <div
            ref={previewRef}
            className="relative inline-block w-80 h-80 mx-auto rounded-lg overflow-hidden shadow-lg"
          >
            {/* Background Image (Cropped) */}
            <img
              src={croppedImageUrl}
              alt="Your cropped image"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Frame Overlay */}
            <Image
              src={selectedTeam.frameUrl}
              alt={`${selectedTeam.name} frame`}
              fill
              className="object-cover pointer-events-none"
              sizes="320px"
            />
          </div>
        </div>

        {/* Team Info */}
        <div className="text-center bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {selectedTeam.name}
          </h3>
          {selectedTeam.description && (
            <p className="text-sm text-gray-600 mb-3">
              {selectedTeam.description}
            </p>
          )}
          <div className="flex items-center justify-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedTeam.color }}
            />
            <span className="text-sm font-medium text-gray-700">
              {campaignConfig.subtitle}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{campaignConfig.buttonTexts.generating}</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>{campaignConfig.buttonTexts.downloadProfilePicture}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
