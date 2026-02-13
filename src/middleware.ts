import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAdmin = token?.role === "ADMIN"
    const pathname = req.nextUrl.pathname

    const isPublicExact =
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/admin/login" ||
      pathname === "/api/admin/login" ||
      pathname === "/api/health"

    const isPublicPrefix =
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/checkout") ||
      pathname.startsWith("/api/webhooks")

    if (isPublicExact || isPublicPrefix) return NextResponse.next()

    const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/")
    const isAdminApi = pathname === "/api/admin" || pathname.startsWith("/api/admin/")
    const isCoursePage = pathname === "/lessons" || pathname.startsWith("/lessons/") || pathname === "/dashboard" || pathname.startsWith("/dashboard/")

    if (isAdminPage || isAdminApi) {
      if (!isAuth) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        return NextResponse.redirect(new URL("/admin/login", req.url))
      }
      if (!isAdmin) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        return NextResponse.redirect(new URL("/dashboard?error=admin_only", req.url))
      }
      return NextResponse.next()
    }

    if (isCoursePage && !isAuth) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
