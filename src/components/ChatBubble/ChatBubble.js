import React from "react";
import { ChatBubble } from "monkas-chat";

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
