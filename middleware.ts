export const config = {
  matcher: "/api/:path*", // Apply only to API routes (or adjust as needed)
  runtime: "nodejs", // 🔹 Forces middleware to use Node.js instead of Edge
};


export { auth as middleware } from '@/auth';