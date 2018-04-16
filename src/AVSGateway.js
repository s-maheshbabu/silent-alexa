import { urls, paths } from "./AVSEndPoints";
import { cannedErrorResponses, customErrorCodes } from "./CannedErrorResponses";
import { cannedResponses } from "./CannedResponses";

import IllegalArgumentError from "./errors/IllegalArgumentError";
import { extractAlexaTextResponses as parser } from "./SpeakDirectiveParser";

import { hasIn, List } from "immutable";
import uuid from "uuid/v4";
import util from "util";

const sprintf = require("sprintf-js").sprintf;

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
   * Sends the TextMessage event to AVS and extracts Alexa's responses.
   *
   * @param {String} userRequestToAlexa The request string that the user typed
   * as a request for Alexa. This should not be empty or undefined.
   * @param {String} accessToken The access token to communicate with AVS. This
   * should not be empty of undefined.
   *
   * @returns A list of text responses from Alexa. Will never return undefined or
   * empty list. If an error happens while communicating to AVS or while parsing
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
        let textResponsesFromAlexa;
        if (payload) textResponsesFromAlexa = parser(payload);
        if (
          !textResponsesFromAlexa ||
          // We don't anticipate Alexa to return a response in multiple parts where the first part is empty
          // but the other parts aren't. So, the moment we see that the first part is empty, it is safe to
          // ignore all other parts (which probably don't exist).
          !textResponsesFromAlexa.get(0)
        )
          textResponsesFromAlexa = List.of(
            cannedResponses.EMPTY_RESPONSE_FROM_ALEXA
          );

        return textResponsesFromAlexa;
      } catch (error) {
        console.log(
          "Encountered an error while trying to parse the speak directive from AVS." +
            util.inspect(error, { showHidden: true, depth: null })
        );
      }
    }

    return List.of(this.convertErrorToHumanReadableMessage(payload));
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
