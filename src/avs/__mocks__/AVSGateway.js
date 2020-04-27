import { List } from "immutable";

export const mockAlexaSuccessResponses = List.of(
  "mock alexa success response 1",
  "mock alexa success response 2",
  "mock alexa success response 3"
);

// Mock implementation that always resolves to a successful response from AVS.
export const mockSendTextMessageEventFunction = jest.fn(() =>
  Promise.resolve(mockAlexaSuccessResponses)
);

// Mock implementation that always resolves to a successful response from AVS.
export const mockSendAddOrUpdateReportEventFunction = jest.fn(() => Promise.resolve(true)
);

const mockAVSGateway = jest.fn(() => {
  return {
    sendTextMessageEvent: mockSendTextMessageEventFunction,
    sendAddOrUpdateReportEvent: mockSendAddOrUpdateReportEventFunction
  };
});

export default mockAVSGateway;
