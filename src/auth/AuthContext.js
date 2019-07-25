import React, { useState } from "react";
import IllegalArgumentError from "errors/IllegalArgumentError";
import Cookies from "js-cookie";
import util from "util";

export const AuthContext = React.createContext();

export const AMAZON_LOGIN_COOKIE = "amazon_Login_accessToken";

export default ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const defaultContext = {
    setLWAResponse: lwaResponse => {
      _persist(lwaResponse);
      setIsAuthenticated(Cookies.get(AMAZON_LOGIN_COOKIE) !== undefined);
    },
    isAuthenticated,
    getAccessToken: () => {
      return Cookies.get(AMAZON_LOGIN_COOKIE);
    },
    clear: () => {
      Cookies.remove(AMAZON_LOGIN_COOKIE);
      setIsAuthenticated(false);
    }
  };
  return (
    <AuthContext.Provider value={defaultContext}>
      {children}
    </AuthContext.Provider>
  );
};

const _persist = lwaResponse => {
  const numberOfSecondsInADay = 86400;

  if (lwaResponse && lwaResponse.access_token && lwaResponse.expires_in) {
    Cookies.set(AMAZON_LOGIN_COOKIE, lwaResponse.access_token, {
      expires: lwaResponse.expires_in / numberOfSecondsInADay,
      secure: false // TODO: Change localhost to also use https and then change this to true.
    });
  } else {
    const serializedLWAResponse = util.inspect(lwaResponse, {
      showHidden: true,
      depth: null
    });
    throw new IllegalArgumentError(
      `LoginWithAmazon Authorization response is undefined or 
        doesnt have access_token/expires_in.
        lwaResponse: ${serializedLWAResponse}`
    );
  }
};
