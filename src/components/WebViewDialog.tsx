"use client";

import { useState, useEffect } from "react";
import { useWebViewDetection } from "@/utils/webview-detection";
import Image from "next/image";
import webviewImage from "@/public/example.jpeg";

interface WebViewDialogProps {
  onClose?: () => void;
}

export default function WebViewDialog({ onClose }: WebViewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isWebView = useWebViewDetection();

  useEffect(() => {
    // Check if user has dismissed the dialog before
    const dismissed = localStorage.getItem("webview-dialog-dismissed");

    if (isWebView && !dismissed) {
      // Show dialog after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isWebView]);

  // Prevent background scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling
      document.body.style.overflow = "hidden";
      // Prevent scroll on mobile safari
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      // Restore scrolling
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleDontShowAgain = () => {
    setIsOpen(false);
    localStorage.setItem("webview-dialog-dismissed", "true");
    onClose?.();
  };

  if (!isWebView || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="container bg-white rounded-lg max-w-md w-full mx-4 shadow-xl max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="min-w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Bạn đang mở link này từ Messenger/Zalo...
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-gray-600 mb-4">
            Để có thể ghép frame và tải hình xuống, hãy mở link trong trình
            duyệt chính (Chrome, Safari...). Nếu bạn đã mở link trong trình
            duyệt chính, hãy bỏ qua thông báo này.
          </p>

          {/* Instructions with visual guide */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Cách mở trong trình duyệt:
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Nhấn vào biểu tượng <strong>3 chấm (⋯)</strong> hoặc{" "}
                    <strong>menu</strong> ở góc trên bên phải
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Chọn <strong>"Mở trong trình duyệt"</strong> hoặc{" "}
                    <strong>"Open in Browser"</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual indicator */}
          <div className="flex justify-center">
            <Image
              src={webviewImage}
              alt="webview"
              className="h-auto w-full max-w-sm rounded-lg"
            />
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={handleDontShowAgain}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đã hiểu!
          </button>
        </div>
      </div>
    </div>
  );
}
