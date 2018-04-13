import { extractAlexaTextResponses } from "./SpeakDirectiveParser";
import IllegalArgumentError from "./errors/IllegalArgumentError";

import testData from "./test-data/multipart-response-test-data";

it("throws an error if an empty string is passed as input", () => {
  const input = "";
  testIllegalArgumentHandling(input);
});

it("throws an error if undefined is passed as input", () => {
  let input;
  testIllegalArgumentHandling(input);
});

it("handles the invalid case where the multi-part message has only one part.", () => {
  testIllegalArgumentHandling(testData.multi_part_with_just_one_part.rawData);
});

it("handles the invalid case where the multi-part message has no body in the first part.", () => {
  testIllegalArgumentHandling(testData.multi_part_with_no_body.rawData);
});

it("handles the invalid case where the directive in the AVS response is not a well formatted json.", () => {
  testIllegalArgumentHandling(testData.directive_not_valid_json.rawData);
});

it("handles the invalid case where the directive in the AVS response is well formatted json but doesn't contain the 'directive' key.", () => {
  testIllegalArgumentHandling(
    testData.directive_key_doesnt_exist_in_avs_directive.rawData
  );
});

it("handles the invalid case where the directive in the AVS response is well formatted json but doesn't contain the 'payload' key.", () => {
  testIllegalArgumentHandling(
    testData.payload_key_doesnt_exist_in_avs_directive.rawData
  );
});

it("handles the invalid case where the directive in the AVS response is well formatted json but doesn't contain the 'caption' key.", () => {
  testIllegalArgumentHandling(
    testData.caption_key_doesnt_exist_in_avs_directive.rawData
  );
});

it("does not include non-text parts in Alexa's response", () => {
  const testObject = testData.multi_part_with_different_content_types;

  const alexaTextResponses = extractAlexaTextResponses(testObject.rawData);
  expect(alexaTextResponses).toEqual(testObject.alexaResponses);
});

it("handles the case where Alexa's text response is broken into more than one part", () => {
  const testObject = testData.multi_part_with_just_three_parts;

  const alexaTextResponses = extractAlexaTextResponses(testObject.rawData);
  expect(alexaTextResponses).toEqual(testObject.alexaResponses);
});

it("extracts Alexa's response in the happy case", () => {
  const testObject = testData.happy_case;

  const alexaTextResponses = extractAlexaTextResponses(testObject.rawData);
  expect(alexaTextResponses).toEqual(testObject.alexaResponses);
});

it("handles gracefully when Alexa doesn't say anything in response. For ex, when user says 'stop'", () => {
  const testObject = testData.happy_case_when_alexa_chooses_to_say_nothing;

  const alexaTextResponses = extractAlexaTextResponses(testObject.rawData);
  expect(alexaTextResponses).toEqual(testObject.alexaResponses);
});

/**
 * Verifies that the given input results in an {IllegalArgumentError} when parsed.
 * @param {String} input The multi part response string that needs to be parsed.
 */
const testIllegalArgumentHandling = input => {
  expect(() => {
    extractAlexaTextResponses(input);
  }).toThrow(IllegalArgumentError);
};
