import { hasIn } from "immutable";
import util from "util";

export default class AuthenticationInfo {
  constructor(authResponse) {
    if (arguments.length == 1 && this.validateAuthResponse(authResponse)) {
      var _access_token = authResponse.access_token;
      var _expires_in = authResponse.expires_in;
    }
    this.getAccessToken = function() {
      return _access_token;
    };
  }

  isValid() {
    return this.getAccessToken() ? true : false;
  }

  validateAuthResponse(authResponse) {
    if (
      hasIn(authResponse, ["access_token"]) &&
      hasIn(authResponse, ["expires_in"]) &&
      authResponse.access_token &&
      authResponse.expires_in
    ) {
      return true;
    } else {
      console.log(
        "Encountered an error on login: " +
          util.inspect(authResponse, { showHidden: true, depth: null })
      );
      return false;
    }
  }
}
