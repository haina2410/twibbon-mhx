"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { Team, campaignConfig } from "@/data";
import "react-image-crop/dist/ReactCrop.css";

interface ImagePreviewProps {
  imageFile: File;
  selectedTeam: Team;
  onCropComplete: (croppedImageUrl: string) => void;
}

export default function ImagePreview({
  imageFile,
  selectedTeam,
  onCropComplete,
}: ImagePreviewProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load the image file
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  // Generate cropped image when crop changes
  useEffect(() => {
    if (completedCrop && imgRef.current && canvasRef.current) {
      generateCroppedImage();
    }
  }, [completedCrop]);

  const generateCroppedImage = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to match the frame (512x512)
    canvas.width = 512;
    canvas.height = 512;

    // Calculate the crop area in natural image coordinates
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Draw the cropped image to fill the entire canvas
    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, 512, 512);

    // Convert to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onCropComplete(url);
      }
    }, "image/png");
  }, [completedCrop, onCropComplete]);

  const handleCropComplete = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop);
  }, []);

  if (!imageSrc) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading image...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {campaignConfig.instructions.cropImage}
      </h2>

      <div className="space-y-6">
        {/* Crop Interface */}
        <div className="relative">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={handleCropComplete}
            aspect={1}
            className="max-w-full"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              className="max-w-full h-auto"
              onLoad={() => {
                // Set initial crop when image loads
                if (imgRef.current) {
                  const { width, height } = imgRef.current;
                  const size = Math.min(width, height) * 0.8;
                  const x = (width - size) / 2;
                  const y = (height - size) / 2;

                  setCrop({
                    unit: "px",
                    width: size,
                    height: size,
                    x: x,
                    y: y,
                  });
                }
              }}
            />
          </ReactCrop>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                {campaignConfig.instructions.cropInstructions.title}
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    {campaignConfig.instructions.cropInstructions.dragCorners}
                  </li>
                  <li>
                    {campaignConfig.instructions.cropInstructions.dragCenter}
                  </li>
                  <li>
                    {campaignConfig.instructions.cropInstructions.autoApply}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Preview with Frame */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Preview with {selectedTeam.name} Frame
          </h3>
          <div className="relative inline-block">
            <div className="relative w-64 h-64 mx-auto">
              {/* Background (cropped image will be here) */}
              <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  Crop area will appear here
                </span>
              </div>

              {/* Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src={selectedTeam.frameUrl}
                  alt={`${selectedTeam.name} frame`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" width={512} height={512} />
    </div>
  );
}
