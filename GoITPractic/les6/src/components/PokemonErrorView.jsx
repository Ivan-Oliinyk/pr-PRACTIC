import React from "react";

const PokemonErrorView = ({ message }) => {
  return (
    <div role="alert">
      <img
        src="https://thumbs.dreamstime.com/z/achtung-23875549.jpg"
        alt="alert"
        width="240"
      />
      <p>{message}</p>
    </div>
  );
};

export default PokemonErrorView;
