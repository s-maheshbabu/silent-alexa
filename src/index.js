import React from "react";
import ReactDOM from "react-dom";
import "index.css";
import App from "App/App";
import AuthContext from "auth/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from "registerServiceWorker";

ReactDOM.render(
  <Router>
    <AuthContext>
      <App />
    </AuthContext>
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
