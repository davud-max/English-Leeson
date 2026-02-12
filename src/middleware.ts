import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAdmin = token?.role === "ADMIN"
    const pathname = req.nextUrl.pathname

    const publicPages = ["/", "/login", "/register", "/checkout", "/api/auth", "/api/checkout", "/api/webhooks"]
    const adminPages = ["/admin"]
    const coursePages = ["/lessons", "/dashboard"]

    const isPublicPage = publicPages.some(page => pathname.startsWith(page))
    const isAdminPage = adminPages.some(page => pathname.startsWith(page))
    const isCoursePage = coursePages.some(page => pathname.startsWith(page))

    if (isPublicPage) return NextResponse.next()

    if (isAdminPage) {
      if (!isAuth) return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url))
      if (!isAdmin) return NextResponse.redirect(new URL("/dashboard?error=admin_only", req.url))
      return NextResponse.next()
    }

    if (isCoursePage) {
      if (!isAuth) {
        const callbackUrl = encodeURIComponent(pathname)
        return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url))
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}