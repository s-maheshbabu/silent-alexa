import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "ChatWindow/ChatWindow";
import RightPanel from "RightPanel/RightPanel";
import WelcomeScreen from "WelcomeScreen/WelcomeScreen";

import { useCookies } from "react-cookie";

import { Route, Switch } from "react-router-dom";
import LoginHandler from "LoginHandler/LoginHandler";
import DefaultRedirect from "DefaultRedirect/DefaultRedirect";
import LoginFailedScreen from "../LoginFailedScreen/LoginFailedScreen";

import { AMAZON_LOGIN_COOKIE } from "Constants";

export default function Body() {
  const [cookies] = useCookies([AMAZON_LOGIN_COOKIE]);

  let componentToRender;
  if (cookies[AMAZON_LOGIN_COOKIE] !== undefined) {
    componentToRender = [
      <MuiThemeProvider key="muiThemeProvider">
        <ChatWindow />
      </MuiThemeProvider>,

      <RightPanel key="rightPanel" />
    ];
  }
  else
    componentToRender = <WelcomeScreen />

  return (
    <Switch>
      <Route exact path={["/authresponse"]} >
        <LoginHandler />
      </Route>
      <Route exact path={["/access_denied"]}  >
        <LoginFailedScreen />
      </Route>
      <Route exact path={["/"]}  >
        {componentToRender}
      </Route>
      <Route exact path="/:foo+">
        <DefaultRedirect />
      </Route>
    </Switch>
  );
}
