import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

export interface IRadioInteface {
  checkboxname?: string;
  checkboxId?: string;
  sourse: string;
  imgAlt: string;
  imgWidth: number | string;
  imgHeigth: number | string;
  text: string;
  value: string;
}

const RadioInputWrapper = styled.div`
  position: relative;
  /* margin-top: 2.5rem; */
`;

const Input = styled.input`
  position: absolute;
  appearance: none;

  &:checked + label:before {
    border-color: ${baseTheme.colors.blueV1};
  }

  &:checked + label:after {
    opacity: 1;
  }

  &:checked + label {
    border-color: ${baseTheme.colors.blueV1};
    box-shadow: inset 0 0 3px ${baseTheme.colors.blueV1};
  }
`;

const Label = styled.label`
  padding: 0 3rem 0 6rem;
  display: flex;
  align-items: center;
  max-width: 40rem;
  min-height: 8.8rem;
  border: 1px solid ${baseTheme.colors.greySecondary};
  border-radius: 1rem;
  cursor: pointer;
  transition: all 250ms linear;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 3rem;
    z-index: 1;
    transform: translateY(-50%);
    display: block;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    border: 2px solid ${baseTheme.colors.greySecondary};
    transition: all 250ms linear;
  }

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 3.45rem;
    z-index: 2;
    transform: translateY(-50%);
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: ${baseTheme.colors.blueV1};
    opacity: 0;
    transition: all 250ms linear;
  }
`;

const LabelContent = styled.div`
  display: flex;
  align-items: center;

  div {
    font-size: 1.6rem;
    line-height: 1.6rem;
    font-weight: 700;
  }
`;

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
    <RadioInputWrapper>
      <Input type="radio" name={checkboxname} id={checkboxId} value={value} />
      <Label htmlFor={checkboxId}>
        <LabelContent>
          <img src={sourse} alt={imgAlt} width={imgWidth} height={imgHeigth} />
          <div>{text}</div>
        </LabelContent>
      </Label>
    </RadioInputWrapper>
  );
};
