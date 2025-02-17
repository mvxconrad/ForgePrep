import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GoogleAuth = () => {
  const handleSuccess = (response) => {
    console.log("Google Login Success:", response);
  };

  const handleFailure = (error) => {
    console.log("Google Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="588883044961-15sl1jthtte8vqsh2aodu7lqf16r3i55.apps.googleusercontent.com">
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
