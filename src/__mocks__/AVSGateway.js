export const mockAlexaSuccessResponse = "mock alexa success response";

// Mock implementation that always resolves to a successful response from AVS.
export const mockSendTextMessageEventFunction = jest.fn(() =>
  Promise.resolve(mockAlexaSuccessResponse)
);

const mockAVSGateway = jest.fn().mockImplementation(() => {
  return { sendTextMessageEvent: mockSendTextMessageEventFunction };
});

export default mockAVSGateway;
