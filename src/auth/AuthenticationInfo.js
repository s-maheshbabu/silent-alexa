import IllegalArgumentError from "errors/IllegalArgumentError";
import util from "util";

/**
 * Wrapper class to hold access_token and expires_in returned in LoginWithAmazon
 * authorization response.
 * Instances are created only if access_token and expires_in are defined.
 * TODO: Add a function to validate the access_token, that takes into account the
 * value of expires_in
 */
export default class AuthenticationInfo {
  constructor(lwaResponse) {
    if (lwaResponse && lwaResponse.access_token && lwaResponse.expires_in) {
      var _access_token = lwaResponse.access_token;
      var _expires_in = lwaResponse.expires_in;
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

    /**
     * @returns access_token to access Alexa API
     */
    this.getAccessToken = function() {
      return _access_token;
    };
  }
}
