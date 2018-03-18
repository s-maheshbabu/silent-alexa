import React from "react";

import AVSGateway from "./AVSGateway";
import IllegalArgumentError from "./errors/IllegalArgumentError";

import { urls, paths } from "./AVSEndPoints";
import { cannedErrorResponses, customErrorCodes } from "./CannedErrorResponses";
import { cannedResponses } from "./CannedResponses";

import testData from "./test-data/multipart-response-test-data";

// A mock parser that uses the real implementation by default.
jest.mock("./SpeakDirectiveParser", () => {
  return {
    extractAlexaTextResponse: jest.fn(
      require.requireActual("./SpeakDirectiveParser").extractAlexaTextResponse
    )
  };
});
const parser = require("./SpeakDirectiveParser");

jest.mock("uuid/v4", () => {
  return jest.fn(() => "mock-uuid-generated-for-testing");
});
const uuid = require("uuid/v4");

const fetchMock = require("fetch-mock");

const unitUnderTest = new AVSGateway();

afterEach(() => {
  fetchMock.restore();
});

test("that sending a testRequest throws if the message itself is empty", async () => {
  expect.assertions(2);

  const testMessage = "";
  await expect(unitUnderTest.sendTextMessageEvent(testMessage)).rejects.toEqual(
    expect.any(IllegalArgumentError)
  );

  let nullMessage;
  await expect(unitUnderTest.sendTextMessageEvent(nullMessage)).rejects.toEqual(
    expect.any(IllegalArgumentError)
  );
});

test("that sending a testRequest throws if the accessToken empty", async () => {
  expect.assertions(2);

  const userRequestToAlexa = "user request to Alexa";
  const accessToken = "";

  await expect(
    unitUnderTest.sendTextMessageEvent(userRequestToAlexa, accessToken)
  ).rejects.toEqual(expect.any(IllegalArgumentError));

  let nullAccessToken;
  await expect(
    unitUnderTest.sendTextMessageEvent(userRequestToAlexa, nullAccessToken)
  ).rejects.toEqual(expect.any(IllegalArgumentError));
});

it("handles gracefully if AVS returns INVALID_REQUEST_EXCEPTION error code", () => {
  testErrorResponseFromAVSHandling("INVALID_REQUEST_EXCEPTION", 400);
});

it("handles gracefully if AVS returns UNAUTHORIZED_REQUEST_EXCEPTION error code", () => {
  testErrorResponseFromAVSHandling("UNAUTHORIZED_REQUEST_EXCEPTION", 403);
});

it("handles gracefully if AVS returns UNSUPPORTED_MEDIA_TYPE error code", () => {
  testErrorResponseFromAVSHandling("UNSUPPORTED_MEDIA_TYPE", 415);
});

it("handles gracefully if AVS returns THROTTLING_EXCEPTION error code", () => {
  testErrorResponseFromAVSHandling("THROTTLING_EXCEPTION", 429);
});

it("handles gracefully if AVS returns INTERNAL_SERVICE_EXCEPTION error code", () => {
  testErrorResponseFromAVSHandling("INTERNAL_SERVICE_EXCEPTION", 500);
});

it("handles gracefully if AVS returns N/A error code", () => {
  testErrorResponseFromAVSHandling("N/A", 503);
});

it("handles gracefully if AVS returns an unexpected error code", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";
  const errorCode = "an unexpected error code";

  fetchMock.postOnce(urls.NA + paths.EVENTS, {
    status: 500,
    body: {
      header: {
        namespace: "System",
        name: "Exception",
        messageId: "a message id"
      },

      payload: {
        code: errorCode,
        description: "description of the error"
      }
    }
  });

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(
        cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR)
      );
    });
});

it("handles gracefully when the http response is 'ok' and then we fail to parse the text body out of it.", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  fetchMock.postOnce(urls.NA + paths.EVENTS, {
    status: 200,
    body: undefined // response.text() will parse pretty much anything you throw at it. The only way I found to make it fail is to pass it undefined as input.
  });

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(
        cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR)
      );
    });
});

it("handles gracefully when the speak directive parser throws an error", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  // Mock the parser to throw an illegal argument error
  parser.extractAlexaTextResponse.mockImplementationOnce(() => {
    throw new IllegalArgumentError("simulating an illegal argument error");
  });

  fetchMock.postOnce(urls.NA + paths.EVENTS, {
    status: 200,
    body: testData.happy_case.rawData
  });

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(
        cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR)
      );
    });
});

it("handles gracefully when the http response is not 'ok' and then we fail to parse the json body out of it.", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  fetchMock.postOnce(urls.NA + paths.EVENTS, {
    status: 500,
    body: "invalid json string"
  });

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(
        cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR)
      );
    });
});

it("calls fetch with the right options when trying to send a happy case TextMessage event and extracts the response string", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  fetchMock.postOnce(urls.NA + paths.EVENTS, testData.happy_case.rawData);

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(testData.happy_case.alexaResponse);
    });

  const requestOptionsUsed = fetchMock.lastOptions();
  expect(requestOptionsUsed).toMatchSnapshot();
});

it("handles the happy case where Alexa returns an empty response. This can happen when Alexa has nothing to say, for example, in response to user saying 'shutup'.", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  fetchMock.postOnce(
    urls.NA + paths.EVENTS,
    testData.happy_case_when_alexa_chooses_to_say_nothing.rawData
  );

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(cannedResponses.EMPTY_RESPONSE_FROM_ALEXA);
    });

  const requestOptionsUsed = fetchMock.lastOptions();
  expect(requestOptionsUsed).toMatchSnapshot();
});

/**
 * Verifies that the given input results in an {IllegalArgumentError} when parsed.
 * @param {String} input The multi part response string that needs to be parsed.
 */
const testErrorResponseFromAVSHandling = async (
  avsErrorCode,
  httpErrorCode
) => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  fetchMock.postOnce(urls.NA + paths.EVENTS, {
    status: httpErrorCode,
    body: {
      header: {
        namespace: "System",
        name: "Exception",
        messageId: "a message id"
      },

      payload: {
        code: avsErrorCode,
        description: "description of the error"
      }
    }
  });

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(cannedErrorResponses.get(avsErrorCode));
    });
};