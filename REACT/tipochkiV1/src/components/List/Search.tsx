import React, { ChangeEvent } from "react";
import { Link } from "react-router-dom";

export type TSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  firstBtnChildren: string;
  secondBtnChildren: string;
  createPath: string;
  moveToPath: string;
};

const handleOnChange =
  (onChange: TSearchInputProps["onChange"]) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

const Search = ({
  value,
  onChange,
  firstBtnChildren,
  secondBtnChildren,
  createPath,
  moveToPath,
}: TSearchInputProps) => {
  return (
    <>
      <div>
        <input
          type="search"
          value={value}
          onChange={handleOnChange(onChange)}
        />
      </div>
      <Link to={createPath}>
        <button className="newBtn" type="button">
          {firstBtnChildren}
        </button>
      </Link>
      <Link to={moveToPath}>
        <button className="cancelBtn" type="button">
          {secondBtnChildren}
        </button>
      </Link>
    </>
  );
};

export default Search;
