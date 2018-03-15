import { urls, paths } from "./AVSEndPoints";
import { cannedErrorResponses, customErrorCodes } from "./CannedErrorResponses";
import { cannedResponses } from "./CannedResponses";

import IllegalArgumentError from "./errors/IllegalArgumentError";

const uuid = require("uuid/v4");
const util = require("util");
const { hasIn } = require("immutable");

const parser = require("./SpeakDirectiveParser");

// TODO: Once the region setting is made configurable by the user, the URLS
// need to ge generated as against hard coded.
const EVENTS_URL = urls.NA + paths.EVENTS;

// Default error repsonse if we encounter any unexpected errors.
const ERROR_MESSAGE = cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR);

/**
 * Manages interactions with AVS
 */
class AVSGateway {
  /**
   * Sends the TextMessage event to AVS and extracts Alexa's response.
   *
   * @param {String} userRequestToAlexa The multi-part response from AVS. This
   * should not be empty or undefined.
   * @param {String} accessToken The multi-part response from AVS. This
   * should not be empty or undefined.
   *
   * @returns The text response from Alexa. An empty response is possible if Alexa
   * said nothing. If an error happens while communicating to AVS or while parsing
   * the responses, a canned human-readable error message is returned.
   */
  async sendTextMessageEvent(userRequestToAlexa, accessToken) {
    if (!userRequestToAlexa || !accessToken) {
      throw new IllegalArgumentError(
        `The request string to Alexa or the access token cannot be empty.
        RequestString: ${userRequestToAlexa}
        AccessToken: ${accessToken}`
      );
    }

    const testMessageEvent = JSON.stringify(
      this.buildTextMessageEvent(userRequestToAlexa)
    );
    const requestOptions = this.buildTextMessageFetchRequestOptions(
      testMessageEvent,
      accessToken
    );

    let isOk = false;
    let payload;
    let responseFromAlexa = ERROR_MESSAGE;
    await fetch(EVENTS_URL, requestOptions)
      .then(response => {
        if (response.ok) {
          isOk = true;
          return response.text();
        } else {
          return response.json();
        }
      })
      .then(data => {
        payload = data;
      })
      .catch(error => {
        isOk = false; // We obtained a successful response but couldn't parse the body, probably because it was malformed.
        console.log(util.inspect(error, { showHidden: true, depth: null }));
      });

    if (isOk) {
      try {
        responseFromAlexa = parser.extractAlexaTextResponse(payload);
        if (!responseFromAlexa)
          responseFromAlexa = cannedResponses.EMPTY_RESPONSE_FROM_ALEXA;

        return responseFromAlexa;
      } catch (error) {
        console.log(
          "Encountered an error while trying to parse the speak directive from AVS." +
            util.inspect(error, { showHidden: true, depth: null })
        );
      }
    }

    return this.convertErrorToHumanReadableMessage(payload);
  }

  convertErrorToHumanReadableMessage(errorPayload) {
    let errorCode;
    if (hasIn(errorPayload, ["payload", "code"]))
      errorCode = errorPayload.payload.code;

    const notSetValue = "no canned response found for given error code";
    let cannedResponse = cannedErrorResponses.get(errorCode, notSetValue);
    if (cannedResponse === notSetValue) {
      return cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR);
    }
    return cannedResponse;
  }

  buildTextMessageFetchRequestOptions(testMessageEvent, accessToken) {
    const data = `--silent-alexa-http-boundary
    Content-Disposition: form-data; name="metadata"
    Content-Type: application/json; charset=UTF-8

    ${testMessageEvent}`;

    return {
      body: data,
      headers: {
        Authorization: "Bearer " + accessToken,
        "content-type":
          "multipart/form-data; boundary=silent-alexa-http-boundary"
      },
      cache: "no-store", // Alexa often responds differently to the same request and so we don't want to cache anything.
      method: "POST"
    };
  }

  buildTextMessageEvent(requestString) {
    return {
      event: {
        header: {
          namespace: "Text",
          name: "TextMessage",
          messageId: uuid()
        },
        payload: {
          textMessage: requestString
        }
      }
    };
  }
}

export default AVSGateway;
