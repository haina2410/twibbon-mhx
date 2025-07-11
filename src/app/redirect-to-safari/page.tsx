"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RedirectToSafariContent() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get("target") || window.location.origin;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Try to open in Safari using URL scheme
    const timer = setTimeout(() => {
      // Try multiple methods to open in Safari
      const methods = [
        `x-web-search://?${encodeURIComponent(targetUrl)}`,
        `safari-https://${targetUrl.replace("https://", "")}`,
        targetUrl,
      ];

      methods.forEach((method, index) => {
        setTimeout(() => {
          window.location.href = method;
        }, index * 1000);
      });
    }, 1000);

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [targetUrl]);

  const handleManualRedirect = () => {
    // Copy URL to clipboard
    navigator.clipboard.writeText(targetUrl).then(() => {
      alert(
        "Link copied to clipboard! Please paste it in Safari for the best experience."
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
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
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Opening in Safari
          </h1>
          <p className="text-gray-600">
            We&apos;re redirecting you to Safari for a better download
            experience.
          </p>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {countdown}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              If redirect doesn&apos;t work:
            </h3>
            <ol className="text-sm text-blue-700 text-left space-y-1">
              <li>1. Tap the Share button (⬆️) below</li>
              <li>2. Select &quot;Open in Safari&quot;</li>
              <li>3. Enjoy better download support!</li>
            </ol>
          </div>

          <button
            onClick={handleManualRedirect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Copy Link & Open Safari
          </button>

          <a
            href={targetUrl}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Continue in Current Browser
          </a>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Preparing redirect...</p>
      </div>
    </div>
  );
}

export default function RedirectToSafari() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RedirectToSafariContent />
    </Suspense>
  );
}
