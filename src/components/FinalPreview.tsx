"use client";

import { useRef, useState } from "react";
import { Team, campaignConfig } from "@/data";
import { saveAs } from "file-saver";

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

  const generateImage = async (): Promise<string> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Canvas context not available");
      return "";
    }

    canvas.width = 2048;
    canvas.height = 2048;

    try {
      // Load and draw the cropped user image
      const userImage = new Image();
      userImage.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        userImage.onload = () => resolve();
        userImage.onerror = () =>
          reject(new Error("Failed to load user image"));
        userImage.src = croppedImageUrl;
      });

      // Draw user image as background, scaled to fill the canvas
      ctx.drawImage(userImage, 0, 0, 2048, 2048);

      // Load and draw the frame overlay
      const frameImage = new Image();
      frameImage.crossOrigin = "anonymous";

      const frameUrl =
        typeof selectedTeam.frameUrl === "string"
          ? selectedTeam.frameUrl
          : selectedTeam.frameUrl.src;

      console.log("Loading frame from URL:", frameUrl);

      await new Promise<void>((resolve, reject) => {
        frameImage.onload = () => {
          console.log(
            "Frame image loaded successfully, dimensions:",
            frameImage.width,
            "x",
            frameImage.height
          );
          resolve();
        };
        frameImage.onerror = (e) => {
          console.error("Failed to load frame image:", e);
          reject(new Error("Failed to load frame image"));
        };
        frameImage.src = frameUrl;
      });

      // Draw frame on top
      console.log("Drawing frame on canvas");
      ctx.drawImage(frameImage, 0, 0, 2048, 2048);

      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const dataUrl = await generateImage();

      await tryDirectDownload(dataUrl);
    } catch (error) {
      console.error("Error generating download:", error);
      alert(
        "Sorry, there was an error generating your image. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const tryDirectDownload = async (dataUrl: string) => {
    try {
      saveAs(dataUrl, `${selectedTeam.name}-profile-picture.png`);
    } catch (error) {
      console.error("Direct download failed:", error);
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
            className="relative inline-block w-80 h-80 mx-auto overflow-hidden shadow-lg"
          >
            {/* Background Image (Cropped) */}
            <img
              src={croppedImageUrl}
              alt="Your cropped image"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Frame Overlay */}
            <img
              src={
                typeof selectedTeam.frameUrl === "string"
                  ? selectedTeam.frameUrl
                  : selectedTeam.frameUrl.src
              }
              alt={`${selectedTeam.name} frame`}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
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
