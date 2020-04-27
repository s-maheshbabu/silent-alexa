import { List } from "immutable";

import AVSGateway, { EVENTS_URL } from "./AVSGateway";
import IllegalArgumentError from "errors/IllegalArgumentError";

import { cannedErrorResponses, customErrorCodes } from "CannedErrorResponses";
import { cannedResponses } from "CannedResponses";

import testData from "./test-data/multipart-response-test-data";
import addOrUpdateReportTestData from "./test-data/EventProcessedDirective";

// A mock parser that uses the real implementation by default.
jest.mock("SpeakDirectiveParser", () => {
  return {
    extractAlexaTextResponses: jest.fn(
      require.requireActual("SpeakDirectiveParser").extractAlexaTextResponses
    )
  };
});
const parser = require("SpeakDirectiveParser");

jest.mock("uuid/v4", () => {
  return jest.fn(() => "mock-uuid-generated-for-testing");
});

import fetchMock from "fetch-mock";

const unitUnderTest = new AVSGateway();

afterEach(() => {
  fetchMock.restore();
});

test("that sending a textRequest throws if the message itself is null, empty or undefined.", async () => {
  expect.assertions(3);

  const textMessage = "";
  await expect(unitUnderTest.sendTextMessageEvent(textMessage)).rejects.toEqual(
    expect.any(IllegalArgumentError)
  );

  let nullMessage;
  await expect(unitUnderTest.sendTextMessageEvent(nullMessage)).rejects.toEqual(
    expect.any(IllegalArgumentError)
  );

  await expect(unitUnderTest.sendTextMessageEvent(undefined)).rejects.toEqual(
    expect.any(IllegalArgumentError)
  );
});

test("that sending a textRequest throws if the accessToken is null, empty or undefined.", async () => {
  expect.assertions(3);

  const userRequestToAlexa = "user request to Alexa";
  const accessToken = "";

  await expect(
    unitUnderTest.sendTextMessageEvent(userRequestToAlexa, accessToken)
  ).rejects.toEqual(expect.any(IllegalArgumentError));

  let nullAccessToken;
  await expect(
    unitUnderTest.sendTextMessageEvent(userRequestToAlexa, nullAccessToken)
  ).rejects.toEqual(expect.any(IllegalArgumentError));

  await expect(
    unitUnderTest.sendTextMessageEvent(userRequestToAlexa, undefined)
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

  fetchMock.postOnce(EVENTS_URL, {
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
        List.of(cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR))
      );
    });
});

it("handles gracefully when the http response is 'ok' and then we fail to parse the text body out of it.", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  fetchMock.postOnce(EVENTS_URL, {
    status: 200,
    body: undefined // response.text() will parse pretty much anything you throw at it. The only way I found to make it fail is to pass it undefined as input.
  });

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(
        List.of(cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR))
      );
    });
});

it("handles gracefully when the speak directive parser throws an error", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  // Mock the parser to throw an illegal argument error
  parser.extractAlexaTextResponses.mockImplementationOnce(() => {
    throw new IllegalArgumentError("simulating an illegal argument error");
  });

  fetchMock.postOnce(EVENTS_URL, {
    status: 200,
    body: testData.happy_case.rawData
  });

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(
        List.of(cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR))
      );
    });
});

it("handles gracefully when the http response is not 'ok' and then we fail to parse the json body out of it.", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  fetchMock.postOnce(EVENTS_URL, {
    status: 500,
    body: "invalid json string"
  });

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(
        List.of(cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR))
      );
    });
});

it("calls fetch with the right options when trying to send a happy case TextMessage event and extracts the response string", async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  fetchMock.postOnce(EVENTS_URL, testData.happy_case.rawData);

  await unitUnderTest
    .sendTextMessageEvent(userRequestToAlexa, access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toEqual(testData.happy_case.alexaResponses);
    });

  const requestOptionsUsed = fetchMock.lastOptions();
  expect(requestOptionsUsed).toMatchSnapshot();
});

it(`handles the happy case where Alexa returns an empty response (can happen when Alexa has nothing to say, for example, in response to user saying 'shutup')
or responds with nothing (can happen when user says something senseless like 'dramatic ink')`, async () => {
  const userRequestToAlexa = "user request to Alexa";
  const access_token = "a mock access_token";

  const emptyishResponses = [
    testData.happy_case_when_alexa_responds_with_empty_message.rawData,
    testData.happy_case_when_alexa_responds_with_nothing.rawData
  ];

  for (let emptyResponse of emptyishResponses) {
    fetchMock.post(
      EVENTS_URL,
      new Promise(function (resolve) {
        resolve(emptyResponse);
      }),
      {
        overwriteRoutes: true
      }
    );

    await unitUnderTest
      .sendTextMessageEvent(userRequestToAlexa, access_token)
      .then(alexaResponse => {
        expect(alexaResponse).toEqual(
          List.of(cannedResponses.EMPTY_RESPONSE_FROM_ALEXA)
        );
      });

    const requestOptionsUsed = fetchMock.lastOptions();
    expect(requestOptionsUsed).toMatchSnapshot();
  }
});

it("calls fetch with the right options and return true when trying to send a happy case AddOrUpdateReport event", async () => {
  const access_token = "a mock access_token";

  fetchMock.postOnce(EVENTS_URL, addOrUpdateReportTestData.happy_case);

  await unitUnderTest
    .sendAddOrUpdateReportEvent(access_token)
    .then(alexaResponse => {
      expect(alexaResponse).toBe(true);
    });

  const requestOptionsUsed = fetchMock.lastOptions();
  expect(requestOptionsUsed).toMatchSnapshot();
});

it("handles gracefully if AVS returns an error", async () => {
  const access_token = "a mock access_token";
  const error_codes = [400, 401, 403, 415, 429, 500, 503];

  for (let errorCode of error_codes) {
    fetchMock.postOnce(EVENTS_URL, {
      status: errorCode
    });

    await unitUnderTest
      .sendAddOrUpdateReportEvent(access_token)
      .then(alexaResponse => {
        expect(alexaResponse).toBe(false);
      });

    fetchMock.restore();
  }
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

  fetchMock.postOnce(EVENTS_URL, {
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
      expect(alexaResponse).toEqual(
        List.of(cannedErrorResponses.get(avsErrorCode))
      );
    });
};
