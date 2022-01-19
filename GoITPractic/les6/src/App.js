import { Component } from "react/cjs/react.production.min";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PokemonForm from "./components/PokemonForm";
import PokemonInfo from "./components/PokemonInfo";

// varian 1
// export default class App extends Component {
//   state = {
//     pokemon: null,
//     loading: false,
//   };

//   componentDidMount() {
//     this.setState({ loading: true });

//     setTimeout(() => {
//       fetch("https://pokeapi.co/api/v2/pokemon/ditto")
//         .then((res) => res.json())
//         .then((pokemon) => this.setState({ pokemon }))
//         .finally(() => this.setState({ loading: false }));
//     }, 2000);
//   }

//   render() {
//     return (
//       <>
//         <h1>Pokemon</h1>
//         <div>
//           {this.state.loading && <h2>Loading...</h2>}
//           {this.state.pokemon && (
//             <div>
//               <h2>{this.state.pokemon.name}</h2>
//             </div>
//           )}
//           <PokemonForm />
//         </div>
//       </>
//     );
//   }
// }

//VARIAN 2
export default class App extends Component {
  state = {
    pokemonName: null,
  };

  handleFormSubmit = (pokemonName) => {
    console.log(pokemonName);
    this.setState({ pokemonName });
  };

  componentDidMount() {
    this.setState({ loading: true });

    // setTimeout(() => {
    //   fetch("https://pokeapi.co/api/v2/pokemon/ditto")
    //     .then((res) => res.json())
    //     .then((pokemon) => this.setState({ pokemon }))
    //     .finally(() => this.setState({ loading: false }));
    // }, 2000);
  }

  render() {
    return (
      <>
        <ToastContainer autoClose={3000} />
        <h1>Pokemon</h1>
        <div>
          <PokemonForm onSubmit={this.handleFormSubmit} />
          <PokemonInfo pokemonInfo={this.state.pokemonName} />
        </div>
      </>
    );
  }
}
