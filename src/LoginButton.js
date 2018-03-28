import React from "react";

export default function LoginButton(props) {
  // TODO: Add CSS logic to associate LoginWithAmazon image to the button
  return (
    <button type="button" onClick={() => props.onClick()}>
      <img
        alt="loginImage"
        src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
        width="106"
        height="20"
      />
    </button>
  );
}
