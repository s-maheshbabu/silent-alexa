const httpMessageParser = require("http-message-parser");
const { hasIn } = require("immutable");
const util = require("util");

import IllegalArgumentError from "./errors/IllegalArgumentError";

/**
 * This method parses the multi-part AVS responses and extracts the
 * string representing Alexa's response. It strips away other information
 * like binary audio data, ssml tags etc.
 *
 * @param {String} alexaRawResponse The multi-part response from AVS. This
 * should not be empty or undefined.
 */
export function extractAlexaTextResponse(alexaRawResponse) {
  if (!alexaRawResponse) {
    throw new IllegalArgumentError(
      "The response to be parsed cannot be empty. Input: " + alexaRawResponse
    );
  }

  const parsedResponse = httpMessageParser(alexaRawResponse);
  // TODO: !parsedResponse and !parsedResponse.multipart[0].body conditions weren't tested because
  // I couldn't figure out how to mock httpMessageParser responses. While it is safe for now because
  // the library appears to always return a response that contains a body, it needs to be tested.
  if (
    !parsedResponse ||
    !parsedResponse.multipart ||
    !parsedResponse.multipart[0].body ||
    parsedResponse.multipart[0].body.length == 0
  ) {
    throw new IllegalArgumentError(
      "Given response is not a valid multi-part message. Input: " +
        alexaRawResponse
    );
  }

  const avsDirectiveBuffer = parsedResponse.multipart[0].body;
  let avsDirective;
  try {
    avsDirective = JSON.parse(avsDirectiveBuffer);
  } catch (error) {
    throw new IllegalArgumentError(
      `Given directive couldn't be parsed to a JSON object. Input: " ${avsDirectiveBuffer.toString()}
      StackTrace:
      ${util.inspect(error, { showHidden: true, depth: null })}`
    );
  }

  if (!hasIn(avsDirective, ["directive", "payload", "caption"]))
    throw new IllegalArgumentError(
      "Given directive doesn't contain the expected path directive.payload.caption. Input: " +
        avsDirective
    );

  return avsDirective.directive.payload.caption;
}
