import React from "react";
import { ChatBubble } from "react-chat-ui";

import styles from "./ChatBubble.css.js";

export default function(props) {
  return (
    <ChatBubble
      message={props.message}
      bubbleStyles={{
        ...styles.bubbleStyles
      }}
    />
  );
}
