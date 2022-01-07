import React from "react";
import styled from "styled-components";
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

const Input = styled.input`
  margin-top: 2rem;
  padding: 1rem 0;
  width: 100%;
  border: none;
  border-bottom: 1px solid ${baseTheme.colors.greyPrimary};
  color: ${baseTheme.colors.black};
  font-size: 1.6rem;
  outline: none;

  &:hover,
  &:focus {
    &::placeholder {
      color: $color-black;
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
}

const InputText: React.FC<IProps> = ({
  value,
  type = "text",
  name = "text",
  descr = true,
  width = "100%",
}) => {
  return (
    <Wrapper width={width}>
      <Input type={type} name={name} placeholder={value} />
      {descr && <Descr>{value}</Descr>}
    </Wrapper>
  );
};

export default InputText;
