import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { boolean } from "yup";

export class FoodRow extends Component {
  foodRow(food) {
    if (authenticationService.currentUserValue.role === "REGULAR") {
      return (
        <tr key={food.id}>
          <td>{food.name}</td>
          <td>{food.calories}</td>
          <td>{food.totalCarbs}</td>
          <td>{food.totalFat}</td>
          <td>{food.protein}</td>
        </tr>
      );
    }
    if (authenticationService.currentUserValue.role === "PREMIUM") {
      return (
        <tr key={food.id}>
          <td>{food.name}</td>
          <td>{food.calories}</td>
          <td>{food.totalCarbs}</td>
          <td>{food.sugars}</td>
          <td>{food.totalFat}</td>
          <td>{food.saturatedFat}</td>
          <td>{food.cholesterol}</td>
          <td>{food.protein}</td>
          <td>{food.sodium}</td>
          <td>{food.potasium}</td>
          <td>{food.fiber}</td>
        </tr>
      );
    }
  }

  exerciseRow(exercise) {
    return (
      <tr key={exercise.id}>
        <td>{exercise.name}</td>
        <td>{exercise.time}</td>
        <td>{exercise.caloriesBurned}</td>
      </tr>
    );
  }

  render() {
    return (
      <React.Fragment>
        {!this.props.exercise && this.foodRow(this.props.obj)}
        {this.props.exercise && this.exerciseRow(this.props.obj)}
      </React.Fragment>
    );
  }
}

FoodRow.propTypes = {
  obj: PropTypes.object,
  exercise: boolean,
};

export default FoodRow;
