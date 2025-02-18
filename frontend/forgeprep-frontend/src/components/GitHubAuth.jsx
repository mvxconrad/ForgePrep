import GitHubLogin from "react-github-login";

const GitHubAuth = () => {
  const handleSuccess = (response) => {
    console.log("GitHub Login Success:", response);
  };

  const handleFailure = (error) => {
    console.log("GitHub Login Failed:", error);
  };

  return (
    <GitHubLogin
      clientId="Ov23liVxGO4oX1R3f1YN"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      buttonText="Login with GitHub"
    />
  );
};

export default GitHubAuth;
