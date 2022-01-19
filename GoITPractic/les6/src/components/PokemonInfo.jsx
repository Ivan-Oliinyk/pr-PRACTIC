import { Component } from "react";

export default class PokemonInfo extends Component {
  state = {
    pokemon: null,
    loading: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevProps.pokemonInfo;
    const nextName = this.props.pokemonInfo;

    if (prevName !== nextName) {
      console.log("Chnage pokemon name");
      console.log("prevprops => :", prevName);
      console.log("this.props.pokemonInfo => :", nextName);

      this.setState({ loading: true });

      setTimeout(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${nextName}`)
          .then((res) => res.json())
          .then((pokemon) => this.setState({ pokemon }))
          .finally(() => this.setState({ loading: false }));
      }, 1000);
    }
  }

  render() {
    const { pokemon, loading } = this.state;
    const pokemonInfo = this.props;

    return (
      <>
        <div className="PokemonInfo__wrapper">
          <h1>Pokemon info</h1>
          {loading && <p>Loading ... </p>}
          {!pokemonInfo && <div>Enter pokemon name</div>}
          {pokemon && <div>{pokemon.name}</div>}
        </div>
      </>
    );
  }
}
