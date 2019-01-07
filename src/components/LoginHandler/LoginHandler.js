import React from "react";
import queryString from "query-string";
import util from "util";
import AuthenticationInfo from "AuthenticationInfo";
import { hasIn } from "immutable";

export default class LoginHandler extends React.Component {
  render() {
    return null;
  }

  componentWillMount() {
    let lwaResponse;
    // Parses the query string to fetch the login with amazon response object
    if (hasIn(this.props, ["location", "hash"])) {
      lwaResponse = queryString.parse(this.props.location.hash);
    }
    if (this.isLWAResponseValid(lwaResponse)) {
      this.props.updateAuthenticationInfo(new AuthenticationInfo(lwaResponse));
    }

    if (this.props.history) {
      this.props.history.push("/");
    }
  }

  /**
   * @returns true if LoginWithAmazon response is valid
   *          false, otherwise.
   */
  isLWAResponseValid(lwaResponse) {
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
}
