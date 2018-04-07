import { hasIn } from "immutable";

/* 
* Wrapper class to hold access_token and expires_in from authentication response
*/
export default class AuthenticationInfo {
  constructor(authResponse) {
    if (authResponse && authResponse.access_token && authResponse.expires_in) {
      var _access_token = authResponse.access_token;
      var _expires_in = authResponse.expires_in;
    }

    // Verify validity before using the access_token
    this.getAccessToken = function() {
      return _access_token;
    };
  }

  // Returns true if the accessToken is defined and is not empty.
  isValid() {
    return this.getAccessToken() ? true : false;
  }
}
