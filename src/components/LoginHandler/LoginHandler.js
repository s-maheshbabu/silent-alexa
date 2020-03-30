import React, { useContext } from "react";
import { Router, Redirect } from "react-router-dom";
import queryString from "query-string";
import util from "util";
import { AuthContext } from "auth/AuthContextProvider";
import { hasIn } from "immutable";

export default function LoginHandler(props) {
  let lwaResponse;
  // Parses the query string to fetch the login with amazon response object
  if (hasIn(props, ["location", "hash"])) {
    lwaResponse = queryString.parse(props.location.hash);
  }

  const { setLWAResponse } = useContext(AuthContext);
  if (isLWAResponseValid(lwaResponse)) {
    setLWAResponse(lwaResponse);
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
