import { useState, useEffect } from "react";

export function isInWebView(): boolean {
  // Return false for server-side rendering
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // Check for common webview patterns
  const webViewPatterns = [
    /fban|fbav|fbsv|fbid|fb_iab|fb4a|fbios|fblc/i, // Facebook
    /whatsapp/i, // WhatsApp
    /micromessenger/i, // WeChat
    /line/i, // LINE
    /telegram/i, // Telegram
    /instagram/i, // Instagram
    /twitter/i, // Twitter
    /linkedinapp/i, // LinkedIn
    /snapchat/i, // Snapchat
    /tiktok|musically/i, // TikTok
    /discord/i, // Discord
    /slack/i, // Slack
    /android.*wv\)|.*webview.*android/i, // Android WebView
  ];

  // Check if any pattern matches
  const isSpecificWebView = webViewPatterns.some((pattern) =>
    pattern.test(userAgent)
  );

  // iOS WebView detection (UIWebView or WKWebView)
  const isIOSWebView =
    /(iphone|ipod|ipad).*os.*like.*safari/i.test(userAgent) &&
    !/version.*mobile.*safari/i.test(userAgent);

  // Generic webview detection
  const isGenericWebView =
    (window as any).webkit?.messageHandlers ||
    (window as any).Android ||
    (window as any).ReactNativeWebView;

  return isSpecificWebView || isIOSWebView || !!isGenericWebView;
}

// React hook for webview detection
export function useWebViewDetection(): boolean {
  const [isWebView, setIsWebView] = useState<boolean>(false);

  useEffect(() => {
    setIsWebView(isInWebView());
  }, []);

  return isWebView;
}
