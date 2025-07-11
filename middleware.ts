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

function getSpecificInAppBrowser(userAgent: string): string | null {
  if (/Instagram/i.test(userAgent)) return "instagram";
  if (/FBAN|FBAV/i.test(userAgent)) return "facebook";
  if (/Twitter/i.test(userAgent)) return "twitter";
  if (/TikTok/i.test(userAgent)) return "tiktok";
  if (/Line/i.test(userAgent)) return "line";
  if (/MicroMessenger/i.test(userAgent)) return "wechat";
  if (/Snapchat/i.test(userAgent)) return "snapchat";
  if (/LinkedIn/i.test(userAgent)) return "linkedin";
  if (/WhatsApp/i.test(userAgent)) return "whatsapp";
  if (/Telegram/i.test(userAgent)) return "telegram";
  if (/Pinterest/i.test(userAgent)) return "pinterest";
  if (/Reddit/i.test(userAgent)) return "reddit";
  if (/Discord/i.test(userAgent)) return "discord";
  return null;
}

function getDeviceType(userAgent: string): "ios" | "android" | "desktop" {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "desktop";
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const url = request.nextUrl.clone();

  // Detect browser types
  const isInAppBrowser = detectInAppBrowser(userAgent);
  const isMobile = detectMobile(userAgent);
  const specificBrowser = getSpecificInAppBrowser(userAgent);
  const deviceType = getDeviceType(userAgent);

  // Create response with headers
  const response = NextResponse.next();

  // Add custom headers for client-side detection
  response.headers.set("X-Is-In-App-Browser", isInAppBrowser.toString());
  response.headers.set("X-Is-Mobile", isMobile.toString());
  response.headers.set("X-Device-Type", deviceType);

  if (specificBrowser) {
    response.headers.set("X-Specific-Browser", specificBrowser);
  }

  // Auto-redirect in-app browsers to native browsers
  if (isInAppBrowser && isMobile) {
    // Skip redirect for already processed requests
    if (url.searchParams.get("inapp") === "true") {
      return response;
    }

    // Skip redirect for our redirect pages
    if (url.pathname.startsWith("/redirect-to-")) {
      return response;
    }

    // Auto-redirect to appropriate browser
    if (deviceType === "ios") {
      url.pathname = "/redirect-to-safari";
      url.searchParams.set("target", request.url);
      return NextResponse.redirect(url);
    }

    if (deviceType === "android") {
      url.pathname = "/redirect-to-chrome";
      url.searchParams.set("target", request.url);
      return NextResponse.redirect(url);
    }
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
