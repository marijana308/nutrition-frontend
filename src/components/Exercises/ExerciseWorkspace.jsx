import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { authHeader } from "../../helpers/auth-header";
import {
  validateNumber,
  validateNotEmpty,
  areErrorsEmpty,
} from "../../helpers/validations";

export class ExerciseWorkspace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newExercise: this.emptyExercise(),
      errors: {},
    };
  }

  emptyExercise() {
    return {
      username: authenticationService.currentUserValue.username,
      name: "",
      caloriesBurned: "",
      time: "",
    };
  }

  changeNewExercise(e) {
    this.setState({
      newExercise: {
        ...this.state.newExercise,
        [e.target.name]: e.target.value,
      },
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

  changeNewExerciseName(e) {
    this.setState({
      newExercise: {
        ...this.state.newExercise,
        [e.target.name]: e.target.value,
      },
    });
    if (validateNotEmpty(e)) {
      const err = { ...this.state.errors };
      delete err[e.target.name];
      this.setState({
        errors: {
          ...err,
        },
      });
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          [e.target.name]: "Must type something",
        },
      });
    }
  }

  saveNewExercise(e) {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: authHeader("POST"),
      body: JSON.stringify(this.state.newExercise),
    };
    return fetch(`http://localhost:8080/api/exercises/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        alert("Exercise has been saved!");
        this.setState({
          newExercise: this.emptyExercise(),
        });
      });
  }

  updateExercise(e) {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(this.props.chosenExercise),
    };
    return fetch(`http://localhost:8080/api/exercises/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        alert("Exercise has been updated!");
      });
  }

  deleteExercise(id) {
    if (window.confirm("Are you sure?")) {
      const requestOptions = {
        method: "DELETE",
        headers: authHeader("DELETE"),
      };
      return fetch(
        `http://localhost:8080/api/exercises/${id}`,
        requestOptions
      ).then((response) => {
        alert("Exercise has been deleted!");
        this.props.toggleCreateMode();
      });
    }
  }

  style = {
    container: {
      width: "300px",
      marginLeft: "20px",
      marginTop: "10px",
    },
    label: {
      width: "30%",
      color: "dark gray",
    },
    btn: {
      marginTop: "5px",
      width: "90%",
      padding: "10px",
      fontWeight: "bold",
      fontSize: "110%",
      backgroundColor: "gray",
      border: "none",
      color: "white",
      borderRadius: "6px",
    },
    h4: {
      marginLeft: "20px",
      marginBottom: "50px",
    },
  };

  render() {
    return (
      <div className="workspace">
        {this.props.createMode && (
          <div style={this.style.container}>
            <h4 style={this.style.h4}>Create new exercise</h4>
            <form onSubmit={(e) => this.saveNewExercise(e)}>
              <label style={this.style.label} htmlFor="name">
                Name
              </label>
              <input
                className={
                  this.state.errors.name ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="name"
                value={this.state.newExercise.name}
                onChange={(e) => this.changeNewExerciseName(e)}
                required
              />
              <br />
              <label style={this.style.label} htmlFor="caloriesBurned">
                Cal. burned
              </label>
              <input
                className={
                  this.state.errors.caloriesBurned
                    ? "errorBasicInput"
                    : "basicInput"
                }
                type="text"
                name="caloriesBurned"
                value={this.state.newExercise.caloriesBurned}
                onChange={(e) => this.changeNewExercise(e)}
                required
              />
              <br />
              <label style={this.style.label} htmlFor="time">
                Time
              </label>
              <input
                className={
                  this.state.errors.time ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="time"
                value={this.state.newExercise.time}
                onChange={(e) => this.changeNewExercise(e)}
                required
              />
              <br />
              <button
                style={this.style.btn}
                disabled={areErrorsEmpty(this.state.errors)}
                type="submit"
              >
                Save exercise
              </button>
            </form>
          </div>
        )}
        {!this.props.createMode && (
          <div style={this.style.container}>
            <h4 style={this.style.h4}>Edit chosen exercise</h4>
            <form onSubmit={(e) => this.updateExercise(e)}>
              <label style={this.style.label} htmlFor="name">
                Name
              </label>
              <input
                className={
                  this.props.errors.name ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="name"
                value={this.props.chosenExercise.name}
                onChange={(e) => this.props.changeChosenExerciseName(e)}
                required
              />
              <br />
              <label style={this.style.label} htmlFor="caloriesBurned">
                Cal. burned
              </label>
              <input
                className={
                  this.props.errors.caloriesBurned
                    ? "errorBasicInput"
                    : "basicInput"
                }
                type="text"
                name="caloriesBurned"
                value={this.props.chosenExercise.caloriesBurned}
                onChange={(e) => this.props.changeChosenExercise(e)}
                required
              />
              <br />
              <label style={this.style.label} htmlFor="time">
                Time
              </label>
              <input
                className={
                  this.props.errors.time ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="time"
                value={this.props.chosenExercise.time}
                onChange={(e) => this.props.changeChosenExercise(e)}
                required
              />
              <br />
              <button
                style={this.style.btn}
                disabled={areErrorsEmpty(this.props.errors)}
                type="submit"
              >
                Update exercise
              </button>
            </form>
            <button
              style={this.style.btn}
              onClick={(e) => this.deleteExercise(this.props.chosenExercise.id)}
            >
              Delete exercise
            </button>
            <button
              style={this.style.btn}
              onClick={(e) => this.props.toggleCreateMode(e)}
            >
              Create new exercise
            </button>
          </div>
        )}
      </div>
    );
  }
}

ExerciseWorkspace.propTypes = {
  chosenExercise: PropTypes.object,
  createMode: PropTypes.bool,
  toggleCreateMode: PropTypes.func,
  changeChosenExercise: PropTypes.func,
  changeChosenExerciseName: PropTypes.func,
  errors: PropTypes.object,
};

export default ExerciseWorkspace;
