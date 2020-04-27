import { urls, paths } from "AVSEndPoints";
import { cannedErrorResponses, customErrorCodes } from "CannedErrorResponses";
import { cannedResponses } from "CannedResponses";

import IllegalArgumentError from "errors/IllegalArgumentError";
import { extractAlexaTextResponses as parser } from "SpeakDirectiveParser";

import { hasIn, List } from "immutable";
import uuid from "uuid/v4";
import util from "util";

import { PRODUCT_ID, CLIENT_ID } from "Constants";

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

    const textMessageEvent = JSON.stringify(
      this.buildTextMessageEvent(userRequestToAlexa)
    );
    const requestOptions = this.buildTextMessageFetchRequestOptions(
      textMessageEvent,
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

  /**
   * Sends the AddOrUpdateReport event to AVS. This event is meant to proactively
   * inform Alexa about the endpoint.
   * 
   * @returns true if the event has been successfully processed by Alexa and
   * false otherwise. Alexa requires that no other events should be sent if this
   * event is not processed successfully.
   */
  // TODO: We should probably retry three times before propagating failures.
  async sendAddOrUpdateReportEvent(accessToken) {
    const addOrUpdateReportEvent = JSON.stringify(
      this.buildAddOrUpdateReportEvent(accessToken)
    );
    const requestOptions = this.buildAddOrUpdateReportEventFetchRequestOptions(
      addOrUpdateReportEvent,
      accessToken
    );

    let isOk = false;
    await fetch(EVENTS_URL, requestOptions)
      .then(response => {
        if (response.ok) {
          isOk = true;
        }
      }).catch(error => {
        console.log(util.inspect(error, { showHidden: true, depth: null }));
      });;

    return isOk;
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

  buildTextMessageFetchRequestOptions(textMessageEvent, accessToken) {
    const data = sprintf(AVS_REQUEST_BODY, textMessageEvent);

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

  buildAddOrUpdateReportEventFetchRequestOptions(addOrUpdateReportEvent, accessToken) {
    const data = sprintf(AVS_REQUEST_BODY, addOrUpdateReportEvent);

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

  buildAddOrUpdateReportEvent(accessToken) {
    // TODO: Logic for assigning 'deviceSerialNumber' needs to be revisited.
    const DSN = "12345";

    return {
      event: {
        header: {
          namespace: "Alexa.Discovery",
          name: "AddOrUpdateReport",
          payloadVersion: "3",
          messageId: uuid(),
          eventCorrelationToken: uuid()
        },
        payload: {
          scope: {
            type: "BearerToken",
            token: accessToken
          },
          endpoints: [
            {
              endpointId: `${CLIENT_ID}::${PRODUCT_ID}::${DSN}`,
              registration: {
                productId: PRODUCT_ID,
                deviceSerialNumber: DSN
              },
              manufacturerName: "Silent Voice Assistants",
              description: "Interact with voice assistants without having to talk to them.",
              friendlyName: "Silent Alexa",
              displayCategories: ["COMPUTER", "LAPTOP", "TABLET"],
              capabilities: [
                {
                  type: "AlexaInterface",
                  interface: "SpeechSynthesizer",
                  version: "1.0"
                }
              ],
              connections: [
                {
                  type: "UNKNOWN",
                  value: DSN //TODO: Is it reasonable to use a DSN here?
                }
              ]
            }
          ]
        }
      }
    };
  }
}
