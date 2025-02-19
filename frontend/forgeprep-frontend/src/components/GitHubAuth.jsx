import React from "react";

const GitHubAuth = () => {
  const handleGitHubSignIn = () => {
    const clientId = "Ov23liVxGO4oX1R3f1YN";
    const redirectUri = "forgeprep.cdkwiuiu2vzv.us-east-2.rds.amazonaws.com/github/callback"; // Replace with your redirect URI
    const scope = "user:email";
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = githubAuthUrl;
  };

  return (
    <button onClick={handleGitHubSignIn} className="btn btn-dark w-100 mt-2">
      Login with GitHub
    </button>
  );
};

export default GitHubAuth;
