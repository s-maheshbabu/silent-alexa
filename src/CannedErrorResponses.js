const { Map } = require("immutable");

/**
 * We need to show human readable error messages to users when Alexa responds
 * with error codes or we encounter internal/unknown errors.
 * This is a mapping from Alexa/Custom error codes to canned responses.
 * @link https://developer.amazon.com/docs/alexa-voice-service/exceptions.html
 */
// TODO: Change the place holder error responses to real ones.
const cannedErrorResponses = Map({
  INVALID_REQUEST_EXCEPTION: "a canned response for INVALID_REQUEST_EXCEPTION",
  UNAUTHORIZED_REQUEST_EXCEPTION:
    "a canned response for UNAUTHORIZED_REQUEST_EXCEPTION",
  UNSUPPORTED_MEDIA_TYPE: "a canned response for UNSUPPORTED_MEDIA_TYPE",
  THROTTLING_EXCEPTION: "a canned response for THROTTLING_EXCEPTION",
  INTERNAL_SERVICE_EXCEPTION:
    "a canned response for INTERNAL_SERVICE_EXCEPTION",
  "N/A": "a canned response for N/A Exception",

  UNKNOWN_ERROR: "a canned response for UNKNOWN_ERROR"
});

const customErrorCodes = Object.freeze({
  UNKNOWN_ERROR: "UNKNOWN_ERROR"
});

module.exports = {
  cannedErrorResponses: cannedErrorResponses,
  customErrorCodes: customErrorCodes
};
