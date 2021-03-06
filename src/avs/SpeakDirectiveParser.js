import IllegalArgumentError from "errors/IllegalArgumentError";

import { hasIn, getIn, fromJS } from "immutable";
import util from "util";
import httpMessageParser from "http-message-parser";
import webvtt from "node-webvtt";

const TEXT_PART_CONTENT_TYPE = `application/json; charset=UTF-8`;
/**
 * This method parses the multi-part AVS responses and extracts the
 * strings representing Alexa's responses from 'Speak' directives.
 * It strips away other information like binary audio data, ssml
 * tags etc in the 'Speak' directives.
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
  // TODO: !parsedResponse condition isn't tested because mocking httpMessageParser responses turned
  // out to be more involved than expected. While it is safe for now because the library appears to
  // always return a response that contains a body, it needs to be tested.
  if (!parsedResponse || !parsedResponse.multipart) {
    throw new IllegalArgumentError(
      "Given raw response is not a valid multi-part message. Input: " +
      alexaRawResponse
    );
  }

  // TODO: part.headers and part.body being undefined or null isn't tested because
  // mocking httpMessageParser responses turned out to be more involved than expected.
  // While it is safe for now because the library appears to always return a response
  // that contains a body, it needs to be tested.
  const textParts = parsedResponse.multipart
    .filter(
      part =>
        TEXT_PART_CONTENT_TYPE === getIn(part, ["headers", "Content-Type"]) &&
        part.body
    )
    .map(part => part.body);

  const alexaResponses = [];
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

    _validateDirective(avsDirective);
    // Directives that are not Speak directives (for ex, ExpectSpeech** directive) will be skipped for now. Tracking
    // item to handle ExpectSpeech directives - https://github.com/s-maheshbabu/silent-alexa/issues/62
    // ** https://developer.amazon.com/docs/alexa-voice-service/speechrecognizer.html#expectspeech
    if (!_isSpeakDirective(avsDirective)) {
      console.log(
        "A non-Speak directive was encountered. Skipping the directive. " +
        util.inspect(avsDirective, { showHidden: true, depth: null })
      );
      continue;
    }

    alexaResponses.push(..._extractCaption(avsDirective));
  }

  return fromJS(alexaResponses);
}

/**
 * This method parses the captions in the Speak directives. This can handle
 * both WEBVTT type captions and plain string captions. Any other types of
 * captions will be ignored.
 *
 * @param avsDirective The avsDirective containing the captions.
 *
 * @returns a List of text responses from Alexa. All the responses will be
 * valid strings but a response can be empty if Alexa chooses to say nothing.
 *
 * @throws IllegalArgumentError if Alexa's response couldn't be parsed out
 * of the input. The failure could be because the input is not well formatted
 * or doesn't contain the right fields to fetch Alexa's captions.
 */
function _extractCaption(avsDirective) {
  if (hasIn(avsDirective, ["directive", "payload", "caption", "type"])) {
    if (avsDirective.directive.payload.caption.type !== "WEBVTT") {
      console.warn("An unexpceted captions type. Input: " +
        `${util.inspect(avsDirective, { showHidden: true, depth: null })}`);

      return [];
    }

    let captions;
    try {
      captions = webvtt.parse(avsDirective.directive.payload.caption.content);
    } catch (error) {
      console.error(`${util.inspect(error, { showHidden: true, depth: null })}`)
      throw new IllegalArgumentError(
        "Given captions are not a valid WEBVTT captions. Input: " +
        `${util.inspect(captions, { showHidden: true, depth: null })}`
      );
    }

    const alexaResponses = [];
    captions.cues.map(cue =>
      alexaResponses.push(cue.text)
    )
    return alexaResponses;
  } else if (hasIn(avsDirective, ["directive", "payload", "caption"])) {
    return [avsDirective.directive.payload.caption];
  }

  throw new IllegalArgumentError(
    "Given Speak directive doesn't contain the expected path directive.payload.caption.type. Input: " +
    `${util.inspect(avsDirective, { showHidden: true, depth: null })}`
  );
}

function _validateDirective(avsDirective) {
  if (!hasIn(avsDirective, ["directive", "header", "name"]))
    throw new IllegalArgumentError(
      "Given directive doesn't declare a type at directive.header.name. Input: " +
      `${util.inspect(avsDirective, { showHidden: true, depth: null })}`
    );
}

function _isSpeakDirective(avsDirective) {
  return avsDirective.directive.header.name === "Speak";
}
