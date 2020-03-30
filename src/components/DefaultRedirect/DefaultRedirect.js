import React from "react";
import { Redirect } from "react-router-dom";

/*
  Component to redirect to home page. This component is currently rendered 
  for paths that are not registered URIs. 
*/
export default class DefaultRedirect extends React.Component {
  render() {
    return <Redirect to="/" />;
  }
}
