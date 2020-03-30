import React, { useState } from "react";
import IllegalArgumentError from "errors/IllegalArgumentError";
import Cookies from "js-cookie";
import util from "util";

export const AuthContext = React.createContext();

export const AMAZON_LOGIN_COOKIE = "amazon_Login_accessToken";

// TODO This class is using the presence of AMAZON_LOGIN_COOKIE to mean that the user
// is authenticated. The assumption is that Cookies.get won't return expired cookies. 
// Is it true? If not, we should check for expiration of cookies.
export default ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get(AMAZON_LOGIN_COOKIE) !== undefined);

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
      console.log("Auth info cleared========");
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
      expires: lwaResponse.expires_in / numberOfSecondsInADay, // TODO Why are cookies expiring in an hour?
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
