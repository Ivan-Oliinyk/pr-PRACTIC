import React, { Component } from "react";
import "./Modal.scss";

class Modal extends Component {
  componentDidMount() {
    console.log("componentDidMount");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  render() {
    return (
      <div className="Modal__backdrop">
        <div className="Modal__content">{this.props.children}</div>
      </div>
    );
  }
}

export default Modal;
