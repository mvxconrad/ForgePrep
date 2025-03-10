import React from "react";

const GitHubAuth = () => {
  const handleGitHubSignIn = () => {
    const clientId = "Ov23liVxGO4oX1R3f1YN";
    const redirectUri = "http://18.221.47.222:5173/auth/github/callback"; // Change this for production!
    const scope = "user:email";
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

    window.location.href = githubAuthUrl;
  };

  return (
    <button onClick={handleGitHubSignIn} className="btn btn-dark w-100 mt-2">
      Login with GitHub
    </button>
  );
};

export default GitHubAuth;
