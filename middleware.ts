import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: [
    "/lists/:path*",
    "/dashboard/:path*",
    "/api/lists/:path*",
  ]
} 