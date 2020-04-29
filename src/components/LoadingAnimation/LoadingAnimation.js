import React from "react";
import ReactLoading from "react-loading";
import "./LoadingAnimation.css";

export default function LoadingAnimation(props) {
  return (
    <div id="loading-animation">
      <ReactLoading type={props.type} color={props.color} />
    </div>
  );
}
