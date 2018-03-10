// Invalid case where multi-part message has just one part. This should never happen in real world.
{
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":"caption","url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
`;

  exports.multi_part_with_just_one_part = {
    rawData: rawData
  };
}

// Invalid case where multi-part message is well formatted but there is no body in the first part.
{
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.multi_part_with_no_body = {
    rawData: rawData
  };
}

// Invalid case where the directive in the first part of the message is not well formatted JSON.
{
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{key: "value", invalidJson: []}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.directive_not_valid_json = {
    rawData: rawData
  };
}

// Invalid case where the AVS directive is well formatted but doesn't contain the 'directive' key.
{
  const anyKeyThatIsNot_directive = "notDirective";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"${anyKeyThatIsNot_directive}":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":"caption","url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.directive_key_doesnt_exist_in_avs_directive = {
    rawData: rawData
  };
}

// Invalid case where the AVS directive is well formatted but doesn't contain the 'payload' key.
{
  const anyKeyThatIsNot_payload = "notPayload";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"${anyKeyThatIsNot_payload}":{"caption":"caption","url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.payload_key_doesnt_exist_in_avs_directive = {
    rawData: rawData
  };
}

// Invalid case where the AVS directive is well formatted but doesn't contain the 'caption' key.
{
  const anyKeyThatIsNot_caption = "notCaption";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"${anyKeyThatIsNot_caption}":"caption","url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.caption_key_doesnt_exist_in_avs_directive = {
    rawData: rawData
  };
}

// A multi-part message with three parts. Each of the parts is valid.
// Important to test this because usually multi-part messages from AVS have two parts but sometimes more.
{
  const alexaResponse = "alexa success response";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":"${alexaResponse}","url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponse}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

third-part-of-multi-part-message
--------abcde123--`;

  exports.multi_part_with_just_three_parts = {
    rawData: rawData,
    alexaResponse: alexaResponse
  };
}

// Happy case multi-part message
{
  const alexaResponse = "alexa success response";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":"${alexaResponse}","url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponse}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.happy_case = {
    rawData: rawData,
    alexaResponse: alexaResponse
  };
}

// Happy case where Alexa chooses to remain silent. For ex, when the user says 'shutup'.
{
  const alexaResponse = "";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"c7f315f3-6de6-40c1-807e-8d69ef41d78e"},"payload":{"caption":"${alexaResponse}","url":"cid:GlobalDomain_ActionableAbandon_2b259d35-1caf-432b-ab63-009447af88e6_545084105","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Alexa:Notification#ACRI#GlobalDomain_ActionableAbandon_2b259d35-1caf-432b-ab63-009447af88e6","ssml":"<speak><prosody volume=\"x-loud\"><audio src=\"system_state_active_end.wav\"/></prosody><metadata><promptMetadata><promptId>Error.NLU.Abandoned</promptId><namespace>Platform</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>e04169f9-7a10-4705-8714-8a853817915a</variant><condition/><weight>1</weight><stageVersion>Adm-20140919_230517-32</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.happy_case_when_alexa_chooses_to_say_nothing = {
    rawData: rawData,
    alexaResponse: alexaResponse
  };
}
