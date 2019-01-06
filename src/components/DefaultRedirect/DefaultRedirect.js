import React from "react";

/*
  Component to redirect to home page. This component is currently rendered 
  for paths that are not registered URIs. 
*/
export default class DefaultRedirect extends React.Component {
  render() {
    return null;
  }

  componentWillMount() {
    if (this.props.history) {
      this.props.history.push("/");
    }
  }
}
