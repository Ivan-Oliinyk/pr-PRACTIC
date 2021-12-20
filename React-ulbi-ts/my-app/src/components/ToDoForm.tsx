import React, { useState, useRef } from "react";

interface IToDoFormProps {
  onAdd(title: string): void;
}

export const ToDoForm: React.FC<IToDoFormProps> = (props) => {
  //**// */ use hook useState
  // const [title, setTitle] = useState<string>("");

  // const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  //   setTitle(event.target.value);
  // };

  //**// */ use hook useRef
  const ref = useRef<HTMLInputElement>(null);

  const keyPressHandler = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      //**// */ use hook useState
      // console.log(title);
      // setTitle("");

      //**// */ use hook useRef
      props.onAdd(ref.current!.value); // с помощью ! указываем что там будет не нулл
      ref.current!.value = "";
    }
  };

  return (
    <div className="input-field mt2">
      <input
        //**// */ use hook useState
        // onChange={changeHandler}
        // value={title}

        //**// */ use hook useRef
        ref={ref}
        //
        type="text"
        id="title"
        placeholder="Введите название дел"
        onKeyPress={keyPressHandler}
      />
      <label htmlFor="title" className="active">
        Введите название дел
      </label>
    </div>
  );
};
