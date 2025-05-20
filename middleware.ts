// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  return NextResponse.next(); // no auth logic here anymore
}

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:jpg|jpeg|png|svg|css|js|ico|json|woff2?|ttf|txt)).*)",
    "/(api|trpc)(.*)",
  ],
};
