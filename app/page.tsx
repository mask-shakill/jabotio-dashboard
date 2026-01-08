"use client";

import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Google = () => {
  const [error, setError] = useState<string | null>(null);

  const onSuccess = (credentialResponse: any) => {
    // credentialResponse.credential contains the ID token
    console.log("Google ID Token:", credentialResponse.credential);
    setError(null);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => setError("Login failed")}
        />
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Google;
