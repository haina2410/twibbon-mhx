import { NextRequest, NextResponse } from "next/server";

// Define in-app browser patterns
const IN_APP_BROWSER_PATTERNS = [
  /Instagram/i,
  /FBAN|FBAV/i, // Facebook
  /Twitter/i,
  /TikTok/i,
  /Line/i,
  /MicroMessenger/i, // WeChat
  /Snapchat/i,
  /LinkedIn/i,
  /WhatsApp/i,
  /Telegram/i,
  /Pinterest/i,
  /Reddit/i,
  /Discord/i,
];

// Mobile browser patterns
const MOBILE_PATTERNS = [
  /Android/i,
  /iPhone|iPad|iPod/i,
  /BlackBerry/i,
  /Windows Phone/i,
  /Opera Mini/i,
  /IEMobile/i,
];

function detectInAppBrowser(userAgent: string): boolean {
  return IN_APP_BROWSER_PATTERNS.some((pattern) => pattern.test(userAgent));
}

function detectMobile(userAgent: string): boolean {
  return MOBILE_PATTERNS.some((pattern) => pattern.test(userAgent));
}

function getDeviceType(userAgent: string): "ios" | "android" | "desktop" {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "desktop";
}

function createNativeBrowserUrl(
  originalUrl: string,
  deviceType: "ios" | "android"
): string {
  if (deviceType === "ios") {
    // Try to open in Safari
    return `x-web-search://?${encodeURIComponent(originalUrl)}`;
  } else {
    // Try to open in Chrome on Android
    return `googlechrome://${originalUrl.replace("https://", "")}`;
  }
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const url = request.nextUrl.clone();

  // Detect browser types
  const isInAppBrowser = detectInAppBrowser(userAgent);
  const isMobile = detectMobile(userAgent);
  const deviceType = getDeviceType(userAgent);

  // Create response with headers
  const response = NextResponse.next();

  // Add custom headers for client-side detection
  response.headers.set("X-Is-In-App-Browser", isInAppBrowser.toString());
  response.headers.set("X-Is-Mobile", isMobile.toString());
  response.headers.set("X-Device-Type", deviceType);

  // Auto-redirect in-app browsers to native browsers
  if (
    isInAppBrowser &&
    isMobile &&
    (deviceType === "ios" || deviceType === "android")
  ) {
    // Skip redirect for already processed requests
    if (url.searchParams.get("inapp") === "true") {
      return response;
    }

    // Create native browser URL and redirect
    const nativeBrowserUrl = createNativeBrowserUrl(request.url, deviceType);
    return NextResponse.redirect(nativeBrowserUrl, 301);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
