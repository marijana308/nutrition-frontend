import React, { Component } from "react";
import { authenticationService } from "../../services/authentication.service";
import { authHeader } from "../../helpers/auth-header";
import { Nutrient } from "./Nutrient";
import { validateNumber, areErrorsEmpty } from "../../helpers/validations";

export class TargetsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dailyCalories: authenticationService.currentUserValue.dailyCalories,
      nutrients: [],
      errors: {},
    };
  }

  componentDidMount() {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    fetch(
      `http://localhost:8080/api/nutrients/${authenticationService.currentUserValue.username}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          nutrients: data,
        });
      });
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (validateNumber(e)) {
      const err = { ...this.state.errors };
      delete err[e.target.name];
      this.setState({
        errors: {
          ...err,
        },
      });
    } else {
      this.setState({
        errors: { ...this.state.errors, [e.target.name]: "Must be a number" },
      });
    }
  }

  updateCalories(e) {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: this.state.dailyCalories,
    };
    return fetch(
      `http://localhost:8080/api/updateCalories/${authenticationService.currentUserValue.username}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        let updatedUser = {
          ...authenticationService.currentUserValue,
          dailyCalories: this.state.dailyCalories,
        };
        authenticationService.currentUserSub.next(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        alert("Daily calorie targets have been updated!");
      });
  }

  style = {
    container: {
      margin: "20px",
    },
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
    const { dailyCalories, nutrients } = this.state;
    return (
      <div style={this.style.container}>
        <h3>Daily targets</h3>
        <form onSubmit={(e) => this.updateCalories(e)}>
          <label style={this.style.label} htmlFor="dailyCalories">
            Calories
          </label>
          <input
            className={
              this.state.errors.dailyCalories ? "errorSmallInput" : "smallInput"
            }
            type="text"
            name="dailyCalories"
            value={dailyCalories}
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
        {nutrients.map((nutrient) => (
          <Nutrient key={nutrient.id} nutrient={nutrient} />
        ))}
      </div>
    );
  }
}

export default TargetsPage;
