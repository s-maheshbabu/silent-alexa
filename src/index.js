import React from "react";
import ReactDOM from "react-dom";
import "index.css";
import App from "App/App";
import AuthContext from "auth/AuthContextProvider";
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from "registerServiceWorker";
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(
  <Router>
    <CookiesProvider>
      <AuthContext>
        <App />
      </AuthContext>
    </CookiesProvider>
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
