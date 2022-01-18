import React, { Component } from "react";
import "./Dropdown.css";

class Dropdown extends Component {
  state = {
    visible: false,
  };

  toggle = () => {
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }));
  };

  render() {
    return (
      <div className="Dropdown">
        <button
          type="button"
          className="Dropdown__toggle"
          onMouseDown={this.toggle}
          // onMouseOver={this.toggle}
        >
          {this.state.visible ? "hide" : "show"}
        </button>
        {this.state.visible && <div className="Dropdown__menu">Menu</div>}
      </div>
    );
  }
}

export default Dropdown;
