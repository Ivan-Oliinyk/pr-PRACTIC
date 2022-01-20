import React from "react";

const PokemonDataView = ({ pokemon: { name, stats, sprites } }) => {
  return (
    <>
      <div className="PokemonInfo__wrapper">
        <img
          src={sprites.other["official-artwork"].front_default}
          alt={name}
          width="200"
        />
        <h2>{name}</h2>
        <ul>
          {stats.map((entry) => (
            <li key={entry.stat.name}>
              {entry.stat.name}: {entry.base_stat}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PokemonDataView;
