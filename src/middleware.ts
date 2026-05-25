import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

export default NextAuth(authConfig).auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const userRole = (req.auth?.user as { role?: string })?.role;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/login", "/register", "/"].includes(nextUrl.pathname);

    if (isApiAuthRoute) return NextResponse.next();

    if (isPublicRoute) {
        if (isLoggedIn) {
            if (userRole === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
            if (userRole === "MENTOR") return NextResponse.redirect(new URL("/mentor/dashboard", nextUrl));
            if (userRole === "STUDENT") return NextResponse.redirect(new URL("/student/dashboard", nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // Role based redirection/protection
    if (nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/", nextUrl));
    }
    if (nextUrl.pathname.startsWith("/mentor") && userRole !== "MENTOR") {
        return NextResponse.redirect(new URL("/", nextUrl));
    }
    if (nextUrl.pathname.startsWith("/student") && userRole !== "STUDENT") {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
