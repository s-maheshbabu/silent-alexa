const { List } = require("immutable");

// Invalid case where multi-part message has just one part. This should never happen in real world.
{
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\ncaption", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
`;

  exports.multi_part_with_just_one_part = {
    rawData: rawData
  };
}

// Invalid case where multi-part message is well formatted JSON but there is no body in the first part.
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

// Invalid case where the AVS directive is well formatted JSON but doesn't contain the 'directive' key.
{
  const anyKeyThatIsNot_directive = "notDirective";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"${anyKeyThatIsNot_directive}":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\ncaption", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.directive_key_doesnt_exist_in_avs_directive = {
    rawData: rawData
  };
}

// Invalid case where the AVS directive is well formatted JSON but doesn't contain the 'payload' key.
{
  const anyKeyThatIsNot_payload = "notPayload";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"${anyKeyThatIsNot_payload}":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\ncaption", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.payload_key_doesnt_exist_in_avs_directive = {
    rawData: rawData
  };
}

// Invalid case where the AVS directive is well formatted JSON but doesn't contain the 'caption' key.
{
  const anyKeyThatIsNot_caption = "notCaption";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"${anyKeyThatIsNot_caption}":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\ncaption", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

first-part-of-multi-part-message
--------abcde123--`;

  exports.caption_key_doesnt_exist_in_avs_directive = {
    rawData: rawData
  };
}

// Invalid case where the AVS directive is well formatted JSON but doesn't contain the 'header' key.
{
  const anyKeyThatIsNot_header = "notHeader";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"${anyKeyThatIsNot_header}":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\ncaption", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

first-part-of-multi-part-message
--------abcde123--`;

  exports.header_key_doesnt_exist_in_avs_directive = {
    rawData: rawData
  };
}

// Invalid case where the AVS directive is well formatted JSON but doesn't contain the 'name' key.
{
  const anyKeyThatIsNot_name = "notName";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","${anyKeyThatIsNot_name}":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\ncaption", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

first-part-of-multi-part-message
--------abcde123--`;

  exports.name_key_doesnt_exist_in_avs_directive = {
    rawData: rawData
  };
}

// Invalid case where the caption is in an invalid format (timestamps in the caption are invalid in this test case)
{
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:h0.000 --> 1b:11.1111\nsome-caption", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">some-caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.caption_invalid_format = {
    rawData: rawData
  };
}

// A multi-part message with multiple parts where one part is a valid text response from Alexa and others are either valid non-text responses or parts whose Content-Type is not known.
{
  const validTextResponseContentType = "application/json; charset=UTF-8";
  const validNonTextResponseContentType = "application/octet-stream";
  const emptyContentType = "";
  let missingContentType;

  const alexaResponse = "alexa success response";
  const rawData = String.raw`--------abcde123
Content-Type: ${validTextResponseContentType}

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\n${alexaResponse}", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponse}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: ${validNonTextResponseContentType}

second-part-of-multi-part-message
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: ${emptyContentType}

third-part-of-multi-part-message
--------abcde123--
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: ${missingContentType}

fourth-part-of-multi-part-message
--------abcde123--
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>

fifth-part-of-multi-part-message
--------abcde123--`;

  exports.multi_part_with_different_content_types = {
    rawData: rawData,
    alexaResponses: List.of(alexaResponse)
  };
}

// A multi-part message with multiple valid parts where the text and audio response from Alexa is contained in those parts.
{
  const alexaResponseFirstPart = "alexa success response first part";
  const alexaResponseSecondPart = "alexa success response second part";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\n${alexaResponseFirstPart}", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponseFirstPart}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

first-audio-part-of-multi-part-message
--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\n${alexaResponseSecondPart}", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponseSecondPart}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-audio-part-of-multi-part-message
--------abcde123--`;

  exports.multi_part_with_just_three_parts = {
    rawData: rawData,
    alexaResponses: List.of(alexaResponseFirstPart, alexaResponseSecondPart)
  };
}

// Happy case with a combination of Speak directive, a non-Speak directive and directive without a type (directive.header.name) defined directives
{
  const anyTypeThatIsNot_Speak = "notSpeak";

  const alexaResponse = "alexa success response";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechRecognizer","name":"${anyTypeThatIsNot_Speak}","messageId":"c506fe5f-8296-4618-a52e-2045cb1a6bdd"},"payload":{"timeoutInMilliseconds":8000}}}
--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\n${alexaResponse}", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponse}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123`;

  exports.non_speak_directives = {
    rawData: rawData,
    alexaResponses: List.of(alexaResponse)
  };
}

// Happy case multi-part message
{
  const alexaResponse = "alexa success response";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\n${alexaResponse}", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponse}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.happy_case = {
    rawData: rawData,
    alexaResponses: List.of(alexaResponse)
  };
}

// Happy case multi-part message with a combination and of WEBVTT and plain string captions
{
  const alexaResponseFirstPartFisrtLineWebvttFormat = "alexa success response first part first line in WEBVTT format";
  const alexaResponseFirstPartSecondLineWebvttFormat = "alexa success response first part second line in WEBVTT format";
  const alexaResponseSecondPartPlainStringFormat = "alexa success response second part in plain string format";
  const alexaResponseThirdParttWebvttFormat = "alexa success response third part in WEBVTT format";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\n${alexaResponseFirstPartFisrtLineWebvttFormat}\n\n1\n22:22.222 --> 33:33.333\n${alexaResponseFirstPartSecondLineWebvttFormat}", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponseFirstPartFisrtLineWebvttFormat}${alexaResponseFirstPartSecondLineWebvttFormat}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

first-audio-part-of-multi-part-message
--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":"${alexaResponseSecondPartPlainStringFormat}","url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponseSecondPartPlainStringFormat}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-audio-part-of-multi-part-message
--------abcde123--
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\n${alexaResponseThirdParttWebvttFormat}", "type": "WEBVTT"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">${alexaResponseThirdParttWebvttFormat}</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

third-audio-part-of-multi-part-message
--------abcde123`;

  exports.multi_part_with_just_three_parts = {
    rawData: rawData,
    alexaResponses: List.of(alexaResponseFirstPartFisrtLineWebvttFormat, alexaResponseFirstPartSecondLineWebvttFormat, alexaResponseSecondPartPlainStringFormat, alexaResponseThirdParttWebvttFormat)
  };
}

// Happy case where Alexa chooses to remain silent and returns an empty WEBVTT. For ex, when the user says 'shutup'.
{
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"c7f315f3-6de6-40c1-807e-8d69ef41d78e"},"payload":{"caption":{"content": "WEBVTT\n\n", "type": "WEBVTT"},"url":"cid:GlobalDomain_ActionableAbandon_2b259d35-1caf-432b-ab63-009447af88e6_545084105","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Alexa:Notification#ACRI#GlobalDomain_ActionableAbandon_2b259d35-1caf-432b-ab63-009447af88e6","ssml":"<speak><prosody volume=\"x-loud\"><audio src=\"system_state_active_end.wav\"/></prosody><metadata><promptMetadata><promptId>Error.NLU.Abandoned</promptId><namespace>Platform</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>e04169f9-7a10-4705-8714-8a853817915a</variant><condition/><weight>1</weight><stageVersion>Adm-20140919_230517-32</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.happy_case_when_alexa_responds_with_empty_webvtt_message = {
    rawData: rawData
  };
}

// Happy case where the caption is of an unknown type.
{
  const anyCaptionTypeThatIsNotWebvtt = "anyCaptionTypeThatIsNotWebvtt";
  const rawData = String.raw`--------abcde123
Content-Type: application/json; charset=UTF-8

{"directive":{"header":{"namespace":"SpeechSynthesizer","name":"Speak","messageId":"67ba4c5a-211e-4722-a53d-44c9728f5377"},"payload":{"caption":{"content": "WEBVTT\n\n1\n00:00.000 --> 11:11.111\ncaption", "type": "${anyCaptionTypeThatIsNotWebvtt}"},"url":"cid:f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545","format":"AUDIO_MPEG","token":"amzn1.as-ct.v1.Domain:Application:Knowledge#ACRI#f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV","ssml":"<speak><prosody volume=\"x-loud\"><p xmlns:amazon=\"https://amazon.com/ssml/2017-01-01/\" xmlns:ivona=\"http://www.ivona.com/2009/12/ssml\">caption</p></prosody><metadata><promptMetadata><promptId>AnswerSsml</promptId><namespace>SmartDJ.MusicQA</namespace><locale>en_US</locale><overrideId>default</overrideId><variant>809dfcd2-2807-4eaf-93e9-1130c2db01fa</variant><condition/><weight>1</weight><stageVersion>Adm-20141203_202706-183</stageVersion></promptMetadata></metadata></speak>"}}}
--------abcde123
Content-ID: <f17ff476-0960-443d-9805-3f5d398a3c5d#TextClient:1.0/2018/03/10/09/e59eab82b4da42b684ea5ed33b1955a7/04:05::TNIH_2V.f7f5577a-9b52-41d4-a273-c0796379590fZXV_1490666545>
Content-Type: application/octet-stream

second-part-of-multi-part-message
--------abcde123--`;

  exports.happy_case_unknown_caption_type = {
    rawData: rawData
  };
}

// Happy case where Alexa responds with absolutely nothing. For ex, when user says something senseless like 'dramatic ink'.
{
  const rawData = "";

  exports.happy_case_when_alexa_responds_with_nothing = {
    rawData: rawData
  };
}
