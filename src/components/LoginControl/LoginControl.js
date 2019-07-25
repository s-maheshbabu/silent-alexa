import React, { useContext } from "react";
import HeaderFlatButton from "HeaderFlatButton/HeaderFlatButton";
import { AuthContext } from "auth/AuthContext";

// Options variable to request for implicit grant.
// TODO: Logic for assigning 'deviceSerialNumber' needs to be revisited.
export const options = Object.freeze({
  scope: ["alexa:all", "profile"],
  scope_data: {
    "alexa:all": {
      productID: "Silent_Alexa",
      productInstanceAttributes: { deviceSerialNumber: "12345" }
    }
  },
  popup: false
});

// Redirect path to handle the response from LoginWithAmazon
export const REDIRECT_PATH = "/authresponse";

export default function LoginControl() {
  const { clear, isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <HeaderFlatButton label="Logout" onClick={clear} />;
  } else {
    return <HeaderFlatButton label="Login" onClick={handleLogin} />;
  }
}

function handleLogin() {
  // The authorization service will redirect the user-agent to the redirect path
  // which will contain an authorization response as a URI fragment
  window.amazon.Login.authorize(
    options,
    window.location.href.replace(/\/+$/, "") + REDIRECT_PATH
  );
}
