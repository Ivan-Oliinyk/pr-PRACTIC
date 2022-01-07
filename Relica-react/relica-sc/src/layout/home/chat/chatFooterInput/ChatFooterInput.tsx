import React from "react";
import InputText from "../../../../components/form/InputText";
import { LoadFile, Wrapper } from "./ChatFooterInputStyled";

export const ChatFooterInput: React.FC = () => {
  return (
    <Wrapper>
      <LoadFile>
        <svg width="17" height="17">
          <use href="/images/symbol-defs.svg#icon-file-picture"></use>
        </svg>
      </LoadFile>

      <InputText
        value="Say something nice..."
        descr={false}
        width="85%"
        url="/images/svg/telegram.svg"
        pushMessage={true}
      />
    </Wrapper>
  );
};
