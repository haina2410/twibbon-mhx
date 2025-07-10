"use client";

import { useState } from "react";
import { Team, campaignConfig } from "@/data";
import TeamSelector from "@/components/TeamSelector";
import ImageUpload from "@/components/ImageUpload";
import ImagePreview from "@/components/ImagePreview";
import FinalPreview from "@/components/FinalPreview";
import Image from "next/image";
import mat from "@/public/mat.png";

type Step = "team" | "upload" | "crop" | "final";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("team");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setCurrentStep("upload");
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setCurrentStep("crop");
  };

  const handleCropComplete = (imageUrl: string) => {
    setCroppedImageUrl(imageUrl);
    setCurrentStep("final");
  };

  const handleStartOver = () => {
    setCurrentStep("team");
    setSelectedTeam(null);
    setSelectedImage(null);
    setCroppedImageUrl("");
  };

  const handleBack = () => {
    switch (currentStep) {
      case "upload":
        setCurrentStep("team");
        break;
      case "crop":
        setCurrentStep("upload");
        break;
      case "final":
        setCurrentStep("crop");
        break;
      default:
        break;
    }
  };

  const getStepNumber = (step: Step) => {
    const steps = { team: 1, upload: 2, crop: 3, final: 4 };
    return steps[step];
  };

  const getStepTitle = (step: Step) => {
    return campaignConfig.stepTitles[step];
  };

  const canGoBack = currentStep !== "team";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image src={mat} alt="logo" width={40} height={40} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {campaignConfig.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {campaignConfig.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {canGoBack && (
                <button
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Quay lại</span>
                </button>
              )}

              {currentStep !== "team" && (
                <button
                  onClick={handleStartOver}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>{campaignConfig.buttonTexts.startOver}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center space-x-8">
          {(["team", "upload", "crop", "final"] as Step[]).map(
            (step, index) => {
              const stepNumber = getStepNumber(step);
              const isActive = currentStep === step;
              const isCompleted = getStepNumber(currentStep) > stepNumber;

              return (
                <div key={step} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }
                  `}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          isActive ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {getStepTitle(step)}
                      </p>
                    </div>
                  </div>

                  {index < 3 && (
                    <div
                      className={`
                    w-16 h-0.5 mx-4
                    ${isCompleted ? "bg-green-600" : "bg-gray-200"}
                  `}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Navigation Bar */}
          {canGoBack && (
            <div className="border-b border-gray-200 px-6 py-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Quay lại bước trước</span>
              </button>
            </div>
          )}

          {currentStep === "team" && (
            <TeamSelector
              selectedTeam={selectedTeam}
              onTeamSelect={handleTeamSelect}
            />
          )}

          {currentStep === "upload" && (
            <ImageUpload
              selectedImage={selectedImage}
              onImageSelect={handleImageSelect}
            />
          )}

          {currentStep === "crop" && selectedImage && selectedTeam && (
            <ImagePreview
              imageFile={selectedImage}
              selectedTeam={selectedTeam}
              onCropComplete={handleCropComplete}
            />
          )}

          {currentStep === "final" && croppedImageUrl && selectedTeam && (
            <FinalPreview
              croppedImageUrl={croppedImageUrl}
              selectedTeam={selectedTeam}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">{campaignConfig.footerText}</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.017 0H7.983C3.58 0 0 3.58 0 7.983v4.034C0 16.42 3.58 20 7.983 20h4.034C16.42 20 20 16.42 20 12.017V7.983C20 3.58 16.42 0 12.017 0zM10 15A5 5 0 1110 5a5 5 0 010 10zm6.408-10.845a1.44 1.44 0 01-1.44-1.44 1.44 1.44 0 011.44-1.44 1.44 1.44 0 011.44 1.44 1.44 1.44 0 01-1.44 1.44zM10 6a4 4 0 100 8 4 4 0 000-8z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
