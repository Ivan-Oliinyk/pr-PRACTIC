import React from "react";
import { ImSpinner, imSpinner } from "react-icons/im";
import PokemonDataView from "./PokemonDataView";

const styles = {
  spinner: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
    fontSize: 24,
  },
};

const PokemonPendigView = ({ pokemonName }) => {
  const pokemon = {
    name: pokemonName,
    sprites: {
      other: {
        "official-artwork": {
          front_default: "https://www.freeiconspng.com/uploads/ask-icon-23.jpg",
        },
      },
    },
    stats: [],
  };

  return (
    <div role="alert">
      <div style={styles.spinner}>
        <ImSpinner size="32" className="icon-spin" />
        loading ...
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  );
};

export default PokemonPendigView;
