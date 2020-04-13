import React from "react";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import util from "util";
import { hasIn } from "immutable";
import { useCookies } from "react-cookie";

import { AMAZON_LOGIN_COOKIE } from "Constants";

export default function LoginHandler(props) {
  const [, setCookie] = useCookies([AMAZON_LOGIN_COOKIE]);

  let lwaResponse;
  // Parses the query string to fetch the login with amazon response object
  if (hasIn(props, ["location", "hash"])) {
    lwaResponse = queryString.parse(props.location.hash, { parseNumbers: true });
  }

  if (isLWAResponseValid(lwaResponse)) {
    setCookie(AMAZON_LOGIN_COOKIE, lwaResponse.access_token, {
      maxAge: lwaResponse.expires_in, // TODO Why are cookies expiring in an hour?
      secure: false, // TODO: Change localhost to also use https and then change this to true.
      path: "/"
    });

    return <Redirect to="/" />;
  }
  else
    return <Redirect to="/access_denied" />;
}

/**
 * @returns true if LoginWithAmazon response is valid
 *          false, otherwise.
 */
function isLWAResponseValid(lwaResponse) {
  if (
    !lwaResponse ||
    !lwaResponse.access_token ||
    !lwaResponse.expires_in ||
    lwaResponse.expires_in < 0
  ) {
    console.log(
      "Encountered an error on login: " +
      util.inspect(lwaResponse, { showHidden: true, depth: null })
    );
    return false;
  }
  return true;
}
