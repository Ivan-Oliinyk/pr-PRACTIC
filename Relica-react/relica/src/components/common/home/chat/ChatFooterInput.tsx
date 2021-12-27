import React from "react";

export const ChatFooterInput: React.FC = () => {
  return (
    <div className="message-input__wrapper">
      <div className="load-file">
        <svg className="icon" width="17" height="17">
          <use href="/images/symbol-defs.svg#icon-file-picture"></use>
        </svg>
      </div>

      <div className="input-wrapper">
        <input
          className="input-text"
          type="text"
          name="name"
          placeholder="Say something nice..."
        />
      </div>
    </div>
  );
};
