import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { Role } from "../../helpers/role";

export class Exercises extends Component {
  render() {
    const isPremium =
      authenticationService.currentUserValue.role === Role.Premium;
    const { exercises, appOrCustomExercises } = this.props;
    return (
      <table className={isPremium ? "premiumTable" : "regularTable"}>
        <tbody>
          <tr>
            <td>Name</td>
            <td>Time</td>
            <td>Calories burned</td>
          </tr>
          {exercises.length < 1 && appOrCustomExercises.length < 1 && (
            <tr>
              <td colSpan="3">Add exercises</td>
            </tr>
          )}
          {exercises.map((exercise) => (
            <tr key={exercise.id}>
              <td>{exercise.name}</td>
              <td>{exercise.duration_min} min</td>
              <td>{exercise.nf_calories}</td>
              <td>
                <button
                  onClick={this.props.removeNutritionixExercise.bind(
                    this,
                    exercise.id
                  )}
                >
                  x
                </button>
              </td>
            </tr>
          ))}
          {appOrCustomExercises.map((exercise) => (
            <tr key={exercise.id}>
              <td>{exercise.exerciseName}</td>
              <td>{exercise.time}</td>
              <td>{exercise.caloriesBurned}</td>
              <td>
                <button
                  onClick={this.props.removeAppOrCustomExercise.bind(
                    this,
                    exercise.id
                  )}
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Exercises.propTypes = {
  exercises: PropTypes.array.isRequired,
  appOrCustomExercises: PropTypes.array.isRequired,
  removeNutritionixExercise: PropTypes.func.isRequired,
  removeAppOrCustomExercise: PropTypes.func.isRequired,
};

export default Exercises;
