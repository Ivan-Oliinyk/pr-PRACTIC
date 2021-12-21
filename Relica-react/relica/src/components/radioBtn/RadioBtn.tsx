import React from "react";

interface IRadioInteface {
  checkboxname: string;
  checkboxId: string;
  sourse: string;
  imgAlt: string;
  imgWidth: number | string;
  imgHeigth: number | string;
  text: string;
}

export const RadioBtn: React.FC<IRadioInteface> = ({
  checkboxname,
  checkboxId,
  sourse,
  imgAlt,
  imgWidth,
  imgHeigth,
  text,
}) => {
  return (
    <div className="radio-input__wrapper">
      <input
        className="radio-input"
        type="radio"
        name={checkboxname}
        id={checkboxId}
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
