import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import util from "util";
import { hasIn } from "immutable";
import { useCookies } from "react-cookie";
import AVSGateway from "AVSGateway";
import LoadingAnimation from "LoadingAnimation/LoadingAnimation";

import { AMAZON_LOGIN_COOKIE } from "Constants";

const avs = new AVSGateway();

/*
This component handles the LWAResponse and takes one of the following actions - 
1. Validate the LWAResponse and if it is not valid, route the user to an access_denied page.
2. Try to post AddOrUpdateReportEvent and if it fails, route the user to an access_denied page. While
posting the AddOrUpdateReportEvent, we render a component to indicate to the user that they need to wait.
3. In the happy case, save the LWAResponse access token to Cookies and route the user to the home screen.
*/
export default function LoginHandler(props) {
  const [, setCookie] = useCookies([AMAZON_LOGIN_COOKIE]);
  const [isAddOrUpdateReportEventPosted, setIsAddOrUpdateReportEventPosted] = useState(undefined);

  useEffect(() => {
    const asyncCallback = async () => {
      if (!isLWAResponseValid(lwaResponse)) return;

      setIsAddOrUpdateReportEventPosted(await avs.sendAddOrUpdateReportEvent(lwaResponse.access_token));
    }

    asyncCallback();
  }, []);

  let lwaResponse;
  // Parses the query string to fetch the login with amazon response object
  if (hasIn(props, ["location", "hash"])) {
    lwaResponse = queryString.parse(props.location.hash, { parseNumbers: true });
  }

  // If the LWAResponse itself is invalid, nothing else matters. We can't talk to Alexa anymore.
  // Even when LWAResponse is valid, if the attempt to post the AddOrUpdateReportEvent failed,
  // we should talk to Alexa as per AVS documentation.
  if (!isLWAResponseValid(lwaResponse) || isAddOrUpdateReportEventPosted === false) {
    return <Redirect to="/access_denied" />;
  }

  // This is the state where we are still in the process of posting AddOrUpdateReportEvent.
  if (isAddOrUpdateReportEventPosted === undefined) {
    return <LoadingAnimation type="bars" color="red" />
  }

  // AddOrUpdateReportEvent was posted successfully.
  setCookie(AMAZON_LOGIN_COOKIE, lwaResponse.access_token, {
    maxAge: lwaResponse.expires_in, // TODO Why are cookies expiring in an hour?
    secure: false, // TODO: Change localhost to also use https and then change this to true.
    path: "/"
  });
  return <Redirect to="/" />;
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
