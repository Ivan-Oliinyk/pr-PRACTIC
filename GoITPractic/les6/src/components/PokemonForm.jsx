import { Component } from "react/cjs/react.production.min";
import { ImSearch } from "react-icons/im";
import { toast } from "react-toastify";

export default class PokemonForm extends Component {
  state = {
    pokemonName: "",
  };

  handleNameOnChange = (e) => {
    this.setState({ pokemonName: e.currentTarget.value.toLowerCase() });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.pokemonName.trim() === "") {
      return toast.error("String must be have value !!!");
    }

    this.props.onSubmit(this.state.pokemonName);
    this.setState({ pokemonName: "" });
  };

  render() {
    return (
      <form className="Pokemon__form" onSubmit={this.handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="pokemonName"
          value={this.state.pokemonName}
          onChange={this.handleNameOnChange}
        ></input>
        <button className="btn" type="submit">
          <ImSearch />
          Find
        </button>
      </form>
    );
  }
}
