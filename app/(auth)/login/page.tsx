"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useLoginStore } from "@/store/auth/login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, error, loading, userRole, setError } = useLoginStore();
  const router = useRouter();

  const onSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    await login(idToken);
  };

  useEffect(() => {
    if (!loading && userRole === "admin" && !error) {
      router.push("/");
    }
  }, [loading, userRole, error, router]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => setError("Login failed")}
        />
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {loading && <p className="mt-4">Loading...</p>}
      </div>
    </GoogleOAuthProvider>
  );
}
