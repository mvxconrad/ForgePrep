import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Let browser follow the backend redirect fully
      window.location.href = `https://forgeprep.net/api/auth/verify-email?token=${token}`;
    }
  }, [searchParams]);

  return (
    <div className="text-light text-center py-5">
      <h4>Verifying your email...</h4>
      <p>Please wait while we process your verification.</p>
    </div>
  );
};

export default VerifyEmailPage;
