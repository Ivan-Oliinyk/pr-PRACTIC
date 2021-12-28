import React from "react";

export interface IRadioInteface {
  checkboxname: string;
  checkboxId: string;
  sourse: string;
  imgAlt: string;
  imgWidth: number | string;
  imgHeigth: number | string;
  text: string;
  value: string;
}

export const InputRadio: React.FC<IRadioInteface> = ({
  checkboxname,
  checkboxId,
  sourse,
  imgAlt,
  imgWidth,
  imgHeigth,
  text,
  value,
}) => {
  return (
    <div className="radio-input__wrapper">
      <input
        className="radio-input"
        type="radio"
        name={checkboxname}
        id={checkboxId}
        value={value}
      />
      <label htmlFor={checkboxId} className="radio-input__label">
        <div className="label-content">
          <img src={sourse} alt={imgAlt} width={imgWidth} height={imgHeigth} />
          <div>{text}</div>
        </div>
      </label>
    </div>
  );
};
