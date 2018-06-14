import React from "react";

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
