import React from "react";
import { ChatBubble } from "react-chat-ui";

export default function(props) {
  return (
    <ChatBubble
      message={props.message}
      bubbleStyles={{
        text: {
          fontSize: 20
        },
        chatbubble: {
          background: "mediumslateblue"
        },
        userBubble: {
          background: "lightcoral"
        }
      }}
    />
  );
}
