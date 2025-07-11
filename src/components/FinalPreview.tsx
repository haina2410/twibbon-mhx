"use client";

import { useMemo, useRef, useState } from "react";
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

  // const isMobile = useMemo(() => {
  //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //     navigator.userAgent
  //   );
  // }, []);

  const isInAppBrowser = useMemo(() => {
    return /Instagram|FBAN|FBAV|Twitter|Line|WeChat|MicroMessenger/i.test(
      navigator.userAgent
    );
  }, []);

  const generateImage = async (): Promise<string> => {
    if (!previewRef.current) throw new Error("Preview not found");

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

    try {
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

      return canvas.toDataURL("image/png");
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
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
      const link = document.createElement("a");
      link.download = `${selectedTeam.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-profile-picture.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Direct download failed:", error);
    }
  };

  const handleShareAPI = async () => {
    const downloadUrl = await generateImage();

    try {
      // Convert data URL to blob
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      const file = new File(
        [blob],
        `${selectedTeam.name
          .toLowerCase()
          .replace(/\s+/g, "-")}-profile-picture.png`,
        {
          type: "image/png",
        }
      );

      console.log("Navigator", navigator.canShare());
      alert("Navigator: " + navigator.canShare());

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `${selectedTeam.name} Profile Picture`,
          text: `My ${campaignConfig.subtitle} profile picture!`,
          files: [file],
        });
      } else {
        // Fallback: open in new tab
        window.open(downloadUrl, "_blank");
      }
    } catch (error) {
      console.error("Share failed:", error);
      // Fallback: open in new tab
      window.open(downloadUrl, "_blank");
    }
  };

  const handleLongPress = async () => {
    const downloadUrl = await generateImage();
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
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
          {!isInAppBrowser ? (
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
                  <span>
                    {campaignConfig.buttonTexts.downloadProfilePicture}
                  </span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                Choose Download Method
              </h3>

              {/* Mobile-friendly options */}
              <div className="grid grid-cols-1 gap-3">
                {/* Share API */}
                <button
                  onClick={handleShareAPI}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  <span>Share / Save to Photos</span>
                </button>

                {/* Open in new tab */}
                <button
                  onClick={handleLongPress}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>Open in New Tab</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
