import React from "react";
import "./PageNotFound.css";

export default function WelcomeScreen(props) {
  // TODO: Login button shouldn't show on this page.
  return (
    <div id="page-not-found">
      <h1> Page Not Found (Placeholder page) </h1>
      <h1>
        {" "}
        Don't provide a login button on this page. Link the user to the login
        page or home page{" "}
      </h1>
    </div>
  );
}
