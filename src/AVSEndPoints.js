const paths = Object.freeze({
  EVENTS: "/v20160207/events",
  DIRECTIVES: "/v20160207/directives"
});

const urls = Object.freeze({
  NA: "https://avs-alexa-na.amazon.com",
  EU: "https://avs-alexa-eu.amazon.com",
  FE: "https://avs-alexa-fe.amazon.com"
});

module.exports = {
  urls: urls,
  paths: paths
};
