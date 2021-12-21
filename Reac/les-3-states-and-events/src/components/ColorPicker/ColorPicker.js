import React, { Component } from 'react';
import s from './ColorPicker.module.css';

class ColorPicker extends Component {
  state = {
    activeOptionIdx: 2,
  };

  setActiveIdx = index => {
    this.setState({ activeOptionIdx: index });
  };

  makeOptionClassName = index => {
    const optionClasses = [s.option];

    if (index === this.state.activeOptionIdx) {
      optionClasses.push(s.option_active);
    }

    return optionClasses.join(' ');
  };

  render() {
    const { activeOptionIdx } = this.state;
    const { options } = this.props;
    const { label } = options[activeOptionIdx];

    return (
      <div className={s.container}>
        <h2 className={s.title}>"ColorPicker"</h2>
        <p>Color: {label}</p>
        <div>
          {this.props.options.map(({ label, color }, idx) => {
            const optionClassName = this.makeOptionClassName(idx);

            return (
              <button
                key={label}
                className={optionClassName}
                style={{ backgroundColor: color }}
                onClick={() => this.setActiveIdx(idx)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ColorPicker;
