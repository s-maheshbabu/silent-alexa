import React from "react";
import HeaderFlatButton from "HeaderFlatButton/HeaderFlatButton";
import { useCookies } from "react-cookie";

import { AMAZON_LOGIN_COOKIE } from "Constants";

// TODO: Logic for assigning 'deviceSerialNumber' needs to be revisited.
// LWA options to request implicit grant.
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
  const [cookies, removeCookie] = useCookies([AMAZON_LOGIN_COOKIE]);

  if (cookies[AMAZON_LOGIN_COOKIE] !== undefined) {
    return <HeaderFlatButton label="Logout" onClick={() =>
      clearAccessTokens(removeCookie)
    } />;
  } else {
    return <HeaderFlatButton label="Login" onClick={handleLogin} />;
  }
}

function clearAccessTokens(removeCookie) {
  removeCookie(AMAZON_LOGIN_COOKIE, undefined, {
    maxAge: 0,
    secure: false, // TODO: Change localhost to also use https and then change this to true.
    path: "/"
  });
}

function handleLogin() {
  // The authorization service will redirect the user-agent to the redirect path
  // which will contain an authorization response as a URI fragment
  window.amazon.Login.authorize(
    options,
    window.location.origin + REDIRECT_PATH
  );
}
