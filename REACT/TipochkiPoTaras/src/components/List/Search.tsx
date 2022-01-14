import React, { ChangeEvent } from "react";

export type TSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const handleOnChange =
  (onChange: TSearchInputProps["onChange"]) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

const Search = ({ value, onChange }: TSearchInputProps) => {
  return (
    <div className="input-search">
      <input
        placeholder="Search..."
        type="search"
        value={value}
        onChange={handleOnChange(onChange)}
      />
    </div>
  );
};

export default Search;
