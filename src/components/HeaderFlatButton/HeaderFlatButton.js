import React from "react";
import FlatButton from "material-ui/FlatButton";

import "./HeaderFlatButton.css";

export default function HeaderFlatButton(props) {
  return (
    <FlatButton
      className="header-flat-button"
      label={props.label}
      onClick={() => props.onClick()}
    />
  );
}
