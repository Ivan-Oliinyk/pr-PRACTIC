import React, { Component } from "react";
import { createPortal } from "react-dom";
import "./Modal.scss";

const modalRoot = document.querySelector("#modal-root");
class Modal extends Component {
  componentDidMount() {
    console.log("componentDidMount");
    window.addEventListener("keydown", this.handleKayDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKayDown);
    console.log("componentWillUnmount");
  }

  handleKayDown = (e) => {
    if (e.code === "Escape") {
      this.props.close();
    }
  };

  handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      this.props.close();
    }
  };

  render() {
    return createPortal(
      <div className="Modal__backdrop" onClick={this.handleBackdropClick}>
        <div className="Modal__content">{this.props.children}</div>
      </div>,
      modalRoot
    );
  }
}

export default Modal;
