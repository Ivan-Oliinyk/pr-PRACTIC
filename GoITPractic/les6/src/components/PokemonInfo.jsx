import { Component } from "react";

/////////// ==== VARIAN-1 ***

// export default class PokemonInfo extends Component {
//   state = {
//     pokemon: null,
//     loading: false,
//     error: null,
//   };

//   componentDidUpdate(prevProps, prevState) {
//     const prevName = prevProps.pokemonInfo;
//     const nextName = this.props.pokemonInfo;

//     if (prevName !== nextName) {
//       console.log("Chnage pokemon name");
//       console.log("prevprops => :", prevName);
//       console.log("this.props.pokemonInfo => :", nextName);

//       this.setState({ loading: true, pokemon: null });

//       setTimeout(() => {
//         fetch(`https://pokeapi.co/api/v2/pokemon/${nextName}`)
//           .then((response) => {
//             if (response.ok) {
//               return response.json();
//             }

//             return Promise.reject(
//               new Error(`No pokemon with name = "${nextName}"`)
//             );
//           })
//           .then((pokemon) => this.setState({ pokemon }))
//           .catch((error) => this.setState({ error }))
//           .finally(() => this.setState({ loading: false }));
//       }, 1000);
//     }
//   }

//   render() {
//     const { pokemon, loading, error } = this.state;
//     const { pokemonInfo } = this.props;

//     return (
//       <>
//         <div className="PokemonInfo__wrapper">
//           <h1>Pokemon info</h1>
//           {error && <p>{error.message}</p>}
//           {loading && <p>Loading ... </p>}
//           {!pokemonInfo && <div>Enter pokemon name</div>}
//           {pokemon && (
//             <div>
//               <h2>{pokemon.name}</h2>
//               <img
//                 src={pokemon.sprites.other["official-artwork"].front_default}
//                 alt={pokemon.name}
//                 width="300"
//               />
//             </div>
//           )}
//         </div>
//       </>
//     );
//   }
// }

/////////// ==== VARIAN-2 *** STATE MACHINE
import PokemonErrorView from "./PokemonErrorView";
import PokemonDataView from "./PokemonDataView";
import PokemonPendigView from "./PokemonPendigView";

export default class PokemonInfo extends Component {
  state = {
    pokemon: null,
    error: null,
    status: "idle",
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevProps.pokemonInfo;
    const nextName = this.props.pokemonInfo;

    if (prevName !== nextName) {
      this.setState({ status: "pending" });

      setTimeout(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${nextName}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }

            return Promise.reject(
              new Error(`No pokemon with name = "${nextName}"`)
            );
          })
          .then((pokemon) => this.setState({ pokemon, status: "resolved" }))
          .catch((error) => this.setState({ error, status: "rejected" }));
      }, 1000);
    }
  }

  render() {
    const { pokemon, error, status } = this.state;
    const { pokemonName } = this.props;

    if (status === "idle") {
      return <div className="PokemonInfo__wrapper">Enter pokemon name</div>;
    }

    if (status === "pending") {
      return <PokemonPendigView pokemonName={pokemonName} />;
      // <div className="PokemonInfo__wrapper">Loading ... </div>;
    }

    if (status === "rejected") {
      return <PokemonErrorView message={error.message} />;
    }

    if (status === "resolved") {
      return <PokemonDataView pokemon={pokemon} />;
    }
  }
}
