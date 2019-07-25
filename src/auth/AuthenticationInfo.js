import IllegalArgumentError from "errors/IllegalArgumentError";
import Cookies from "js-cookie";
import util from "util";

/**
 * Wrapper class to hold access_token and expires_in returned in LoginWithAmazon
 * authorization response.
 * Instances are created only if access_token and expires_in are defined. The token
 * is stored in a cookie called 'amazon_Login_accessToken' because that is the
 * cookie that LoginWithAmazon will look for.
 * https://developer.amazon.com/docs/login-with-amazon/javascript-sdk-reference.html#setUseCookie
 */
// TODO: Rename this to AuthenticationManager now that the class has been refactored to not
// actually hold the authentication information.
class AuthenticationInfo {
  persist(lwaResponse) {
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
  }

  /**
   * @returns true is authentication info is present and false otherwise.
   * This does not guarantee that the tokens haven't already expired.
   * Callers should be able to handle the case of tokens being
   * invalid when they try to use them.
   */
  isPresent = () => {
    return this.getAccessToken() !== undefined;
  };

  /**
   * @returns access_token to access Alexa API
   */
  getAccessToken = () => {
    return undefined;
  };

  /**
   * @returns deleted the cookie that stores the authentication info
   */
  clear = () => {
    Cookies.remove(AMAZON_LOGIN_COOKIE);
  };
}

// Declare a singleton
const instance = new AuthenticationInfo();
Object.freeze(instance);

export default instance;
export const AMAZON_LOGIN_COOKIE = "amazon_Login_accessToken";
