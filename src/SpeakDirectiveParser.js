import IllegalArgumentError from "./errors/IllegalArgumentError";

const httpMessageParser = require("http-message-parser");
const { List, hasIn } = require("immutable");
const util = require("util");

/**
 * This method parses the multi-part AVS responses and extracts the
 * strings representing Alexa's responses. It strips away other information
 * like binary audio data, ssml tags etc.
 *
 * @param {String} alexaRawResponse The multi-part response from AVS. This
 * should not be empty or undefined.
 *
 * @returns a List of text responses from Alexa. All the responses will be
 * valid strings but a response can be empty if Alexa chooses to say nothing.
 *
 * @throws IllegalArgumentError if Alexa's response couldn't be parsed out
 * of the input. The failure could be because the input is not well formatted
 * or doesn't contain the right fields to fetch Alexa's response.
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
    parsedResponse.multipart[0].body.length === 0
  ) {
    throw new IllegalArgumentError(
      "Given raw response is not a valid multi-part message. Input: " +
        alexaRawResponse
    );
  }

  // TODO: https://github.com/s-maheshbabu/silent-alexa/issues/22
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

  return List.of(avsDirective.directive.payload.caption);
}
