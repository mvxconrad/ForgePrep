import FacebookLogin from "react-facebook-login";

const FacebookAuth = () => {
  const handleResponse = (response) => {
    console.log("Facebook Login Success:", response);
  };

  return (
    <FacebookLogin
      appId="981364820569168"
      autoLoad={false}
      fields="name,email,picture"
      callback={handleResponse}
      textButton="Login with Facebook"
    />
  );
};

export default FacebookAuth;
