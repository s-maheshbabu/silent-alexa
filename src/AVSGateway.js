import { urls, paths } from "./AVSEndPoints";
import { cannedErrorResponses, customErrorCodes } from "./CannedErrorResponses";
import { cannedResponses } from "./CannedResponses";

import IllegalArgumentError from "./errors/IllegalArgumentError";

const uuid = require("uuid/v4");
const util = require("util");
const { hasIn } = require("immutable");
const sprintf = require("sprintf-js").sprintf;

const parser = require("./SpeakDirectiveParser");

const AVS_REQUEST_BODY = `--silent-alexa-http-boundary
Content-Disposition: form-data; name="metadata"
Content-Type: application/json; charset=UTF-8

%s`;

// TODO: Once the region setting is made configurable by the user, the URLS
// need to ge generated as against hard coded.
export const EVENTS_URL = urls.NA + paths.EVENTS;

/**
 * Manages interactions with AVS
 */
export default class AVSGateway {
  /**
   * Sends the TextMessage event to AVS and extracts Alexa's response.
   *
   * @param {String} userRequestToAlexa The request string that the user typed
   * as a request for Alexa.
   * @param {String} accessToken The access token to communicate with AVS.
   *
   * @returns The text response from Alexa. An empty response is possible if Alexa
   * said nothing. If an error happens while communicating to AVS or while parsing
   * the responses, a canned human-readable error message is returned.
   *
   * @throws IllegalArgumentError if the input is missing or invalid.
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
        let textResponseFromAlexa;
        if (payload)
          textResponseFromAlexa = parser.extractAlexaTextResponse(payload);
        if (!textResponseFromAlexa)
          textResponseFromAlexa = cannedResponses.EMPTY_RESPONSE_FROM_ALEXA;

        return textResponseFromAlexa;
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

    return cannedErrorResponses.get(
      errorCode,
      // default value to return if errorCode doesn't exist
      cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR)
    );
  }

  buildTextMessageFetchRequestOptions(testMessageEvent, accessToken) {
    const data = sprintf(AVS_REQUEST_BODY, testMessageEvent);

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
