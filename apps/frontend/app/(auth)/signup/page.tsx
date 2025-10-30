import SignupForm from "@/components/auth/SignupForm";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function page() {
  const jwtCookie = (await cookies()).get("jwt");

  return (
    <div className="w-screen h-screen relative flex items-center justify-center">
      <Link
        className="fixed text-white top-2 left-3 text-3xl font-pencerio cursor-pointer"
        href="/"
      >
        CollabDraw
      </Link>
      <div  />
      <SignupForm jwtCookie={jwtCookie || null} />
    </div>
  );
}