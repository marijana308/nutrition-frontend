import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { authHeader } from "../../helpers/auth-header";

export class ExerciseSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      isAdmin: authenticationService.currentUserValue.role === "ADMIN", //Role.Admin
    };
  }

  searchCustomExercises(e) {
    const query = e.target.value;
    if (query !== "") {
      const requestOptions = { method: "GET", headers: authHeader("GET") };
      return fetch(
        `http://localhost:8080/api/exercises/${authenticationService.currentUserValue.username}?query=${query}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            exercises: data,
          });
        });
    }
  }

  searchAdminExercises(e) {
    const query = e.target.value;
    if (query !== "") {
      const requestOptions = { method: "GET", headers: authHeader("GET") };
      return fetch(
        `http://localhost:8080/api/exercises/admin?query=${query}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            exercises: data,
          });
        });
    }
  }

  render() {
    return (
      <div className="searchResults">
        {this.state.isAdmin && (
          <input
            className="searchInput"
            type="text"
            placeholder="search exercises to edit..."
            onChange={(e) => this.searchAdminExercises(e)}
          />
        )}
        {!this.state.isAdmin && (
          <input
            className="searchInput"
            type="text"
            placeholder="search exercises to edit..."
            onChange={(e) => this.searchCustomExercises(e)}
          />
        )}
        <br />
        {this.state.exercises.map((exercise) => (
          <React.Fragment>
            <button
              className="searchResultBtn"
              onClick={(e) => {
                this.props.exerciseClicked(exercise);
                this.setState({ exercises: [] });
              }}
            >
              {exercise.name}
            </button>
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  }
}

ExerciseSearch.propTypes = {
  exerciseClicked: PropTypes.func,
};

export default ExerciseSearch;
