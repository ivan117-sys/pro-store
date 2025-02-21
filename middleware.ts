import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {

  const authCookie =
  request.cookies.get("__Secure-authjs.session-token") ||
  request.cookies.get("authjs.session-token");

  // Arry of regex patterns of paths we want to protect
  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/, 
    /\/place-order/, 
    /\/profile/, 
    /\/user\/(.*)/,  
    /\/order\/(.*)/,
    /\/admin\/(.*)/,
  ]

  // Get pathname from the req URL object
   const { pathname } = request.nextUrl;

  if (!authCookie && protectedPaths.some((p) => p.test(pathname))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  

  // Check if sessionCartId exists in the request cookies
  if (!request.cookies.get("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();

    // Create a new response to modify headers
    const response = NextResponse.next();

    // Set the sessionCartId cookie
    response.cookies.set("sessionCartId", sessionCartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  }

  return NextResponse.next();
}


export const config = {
  matcher: "/:path*",
};
