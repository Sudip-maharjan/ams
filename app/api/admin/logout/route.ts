import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_token");
  return response;
}
// ```

// ---

// ## Folder structure after this
// ```
// app/
//   admin/
//     login/
//       page.tsx       ← login form
//     page.tsx         ← dashboard (protected)
//   api/
//     admin/
//       login/
//         route.ts     ← sets cookie
//       logout/
//         route.ts     ← clears cookie
// middleware.ts        ← protects /admin routes
