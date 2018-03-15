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
  } catch (e) {
    throw new IllegalArgumentError(
      `Given directive couldn't be parsed to a JSON object. Input: " ${avsDirectiveBuffer.toString()}
      StackTrace:
      ${util.inspect(e, { showHidden: true, depth: null })}`
    );
  }

  if (!hasIn(avsDirective, ["directive", "payload", "caption"]))
    throw new IllegalArgumentError(
      "Given directive doesn't contain the expected path directive.payload.caption. Input: " +
        avsDirective
    );

  return avsDirective.directive.payload.caption;
}
