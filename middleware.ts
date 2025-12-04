// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has("logged-in");
  const { pathname } = request.nextUrl;

  if (!isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 미들웨어가 동작할 경로 설정
export const config = {
  matcher: ["/", "/login"],
};
