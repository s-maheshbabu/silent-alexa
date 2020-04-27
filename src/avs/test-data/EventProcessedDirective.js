// Happy case EventProcessed directive
{
  const happy_case = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"Alexa","name":"EventProcessed","messageId":"{{STRING}}","eventCorrelationToken":"{{STRING}}"},"payload":{}}}
`;

  exports.happy_case = happy_case;
}
