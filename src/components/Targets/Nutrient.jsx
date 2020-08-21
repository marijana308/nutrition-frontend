import React, { Component } from "react";
import PropTypes from "prop-types";
import { authHeader } from "../../helpers/auth-header";
import { validateNumber, areErrorsEmpty } from "../../helpers/validations";

export class Nutrient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nutrient: this.props.nutrient,
      errors: {},
    };
  }

  updateNutrient(e) {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(this.state.nutrient),
    };
    return fetch(`http://localhost:8080/api/nutrients/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        alert("Nutrient has been updated!");
      });
  }

  change(e) {
    this.setState({
      nutrient: { ...this.state.nutrient, dailyValue: e.target.value },
    });
    if (validateNumber(e)) {
      const err = { ...this.state.errors };
      delete err.nutrient;
      this.setState({
        errors: {
          ...err,
        },
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, nutrient: "Must be a number" },
      });
    }
  }

  style = {
    label: {
      width: "6em",
    },
    basicBtn: {
      padding: "3px",
      backgroundColor: "gray",
      border: "1px solid white",
      color: "white",
      borderRadius: "6px",
    },
  };

  render() {
    const { nutrient } = this.state;
    return (
      <form onSubmit={(e) => this.updateNutrient(e)}>
        <label style={this.style.label}>{nutrient.name} </label>
        <input
          className={
            this.state.errors.nutrient ? "errorSmallInput" : "smallInput"
          }
          type="text"
          name={nutrient.name}
          value={nutrient.dailyValue}
          onChange={(e) => this.change(e)}
          required
        />
        <button
          style={this.style.basicBtn}
          disabled={areErrorsEmpty(this.state.errors)}
          type="submit"
        >
          Update
        </button>
      </form>
    );
  }
}

Nutrient.propTypes = {
  nutrient: PropTypes.object.isRequired,
};

export default Nutrient;
