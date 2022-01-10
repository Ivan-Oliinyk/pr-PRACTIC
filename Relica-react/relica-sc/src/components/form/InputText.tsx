import React from "react";
import styled, { css } from "styled-components";
import { baseTheme } from "../../styles/theme";

type WrapperProps = {
  width?: string;
};

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  width: ${({ width }) => width};

  .user-name__input-descr {
    position: absolute;
    top: 3rem;
    left: 0;
    font-size: 1.2rem;
    color: ${baseTheme.colors.greyPrimary};
    opacity: 0;
    transition: opacity 250ms linear;
  }
`;

interface IInputTextProps {
  pushMessage?: boolean;
  url: string;
}

const Input = styled.input<IInputTextProps>`
  margin-top: 2rem;
  padding: 1rem 0;
  width: 100%;
  border: none;
  border-bottom: 1px solid ${baseTheme.colors.greyPrimary};
  color: ${baseTheme.colors.black};
  font-size: 1.6rem;
  outline: none;

  ${({ pushMessage }) =>
    pushMessage &&
    css`
      position: relative;
      display: flex;
      align-items: center;

      &:after {
        content: "";
        position: absolute;
        right: 3px;
        display: block;
        background: url("./images/svg/telegram.svg");
        background-repeat: no-repeat;
        background-color: red;
        width: 3.4rem;
        height: 3.4rem;
        cursor: pointer;
      }
    `}
  &:hover,
  &:focus {
    &::placeholder {
      color: ${baseTheme.colors.black};
    }
  }

  &:focus + span {
    opacity: 1;
  }
`;

const Descr = styled.span`
  position: absolute;
  top: 1rem;
  left: 0;
  font-size: 1.2rem;
  color: $color-grey-v3;
  opacity: 0;
  transition: opacity 250ms linear;
`;

interface IProps {
  value: string;
  type?: string;
  name?: string;
  descr?: boolean;
  width?: string;
  url?: string;
  pushMessage?: boolean;
}

const InputText: React.FC<IProps> = ({
  value,
  type = "text",
  name = "text",
  descr = true,
  width = "100%",
  url = "",
  pushMessage = false,
}) => {
  return (
    <Wrapper width={width}>
      <Input
        type={type}
        name={name}
        placeholder={value}
        url={url}
        pushMessage={pushMessage}
      />
      {descr && <Descr>{value}</Descr>}
    </Wrapper>
  );
};

export default InputText;
