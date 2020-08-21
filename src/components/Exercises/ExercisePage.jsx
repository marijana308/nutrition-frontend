import React, { Component } from "react";
import ExerciseSearch from "./ExerciseSearch";
import ExerciseWorkspace from "./ExerciseWorkspace";
import { validateNumber, validateNotEmpty } from "../../helpers/validations";

export class ExercisePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createMode: true,
      chosenExercise: {},
      errors: {},
    };
  }

  exerciseClicked = (exercise) => {
    this.setState({
      chosenExercise: exercise,
      createMode: false,
    });
  };

  changeChosenExercise = (e) => {
    this.setState({
      chosenExercise: {
        ...this.state.chosenExercise,
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
  };

  changeChosenExerciseName = (e) => {
    this.setState({
      chosenExercise: {
        ...this.state.chosenExercise,
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
  };

  toggleCreateMode = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      createMode: true,
    });
  };

  render() {
    return (
      <div className="myContainer">
        <ExerciseSearch exerciseClicked={this.exerciseClicked}></ExerciseSearch>
        <ExerciseWorkspace
          chosenExercise={this.state.chosenExercise}
          createMode={this.state.createMode}
          toggleCreateMode={this.toggleCreateMode}
          changeChosenExercise={this.changeChosenExercise}
          changeChosenExerciseName={this.changeChosenExerciseName}
          errors={this.state.errors}
        ></ExerciseWorkspace>
      </div>
    );
  }
}

export default ExercisePage;
