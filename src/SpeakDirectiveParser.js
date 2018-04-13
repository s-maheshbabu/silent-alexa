import IllegalArgumentError from "./errors/IllegalArgumentError";

const httpMessageParser = require("http-message-parser");
const { List, hasIn, getIn, fromJS } = require("immutable");
const util = require("util");

const TEXT_PART_CONTENT_TYPE = `application/json; charset=UTF-8`;
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
export function extractAlexaTextResponses(alexaRawResponse) {
  if (!alexaRawResponse) {
    throw new IllegalArgumentError(
      "The response to be parsed cannot be empty. Input: " + alexaRawResponse
    );
  }

  const parsedResponse = httpMessageParser(alexaRawResponse);
  // TODO: !parsedResponse condition isn't tested because I couldn't figure out
  // how to mock httpMessageParser responses. While it is safe for now because
  // the library appears to always return a response that contains a body, it needs to be tested.
  if (!parsedResponse || !parsedResponse.multipart) {
    throw new IllegalArgumentError(
      "Given raw response is not a valid multi-part message. Input: " +
        alexaRawResponse
    );
  }

  // TODO: part.headers and part.body being undefined or null isn't tested because
  // I couldn't figure out how to mock httpMessageParser responses. While it is safe for now because
  // the library appears to always return a response that contains a body, it needs to be tested.
  const textParts = new Array();
  for (let part of parsedResponse.multipart) {
    if (
      TEXT_PART_CONTENT_TYPE === getIn(part, ["headers", "Content-Type"]) &&
      part.body
    ) {
      textParts.push(part.body);
    }
  }

  const alexaResponses = new Array();
  for (let part of textParts) {
    let avsDirective;
    try {
      avsDirective = JSON.parse(part);
    } catch (error) {
      throw new IllegalArgumentError(
        `Given directive couldn't be parsed to a JSON object. Input: " ${part.toString()}
        StackTrace:
        ${util.inspect(error, { showHidden: true, depth: null })}`
      );
    }

    if (!hasIn(avsDirective, ["directive", "payload", "caption"]))
      throw new IllegalArgumentError(
        "Given directive doesn't contain the expected path directive.payload.caption. Input: " +
          avsDirective
      );

    alexaResponses.push(avsDirective.directive.payload.caption);
  }

  return fromJS(alexaResponses);
}
