import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { totalNutrient } from "../../helpers/calculators";
import { Role } from "../../helpers/role";

export class Sum extends Component {
  sumHeader() {
    if (authenticationService.currentUserValue.role === "REGULAR") {
      return (
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            calories ({authenticationService.currentUserValue.dailyCalories})
          </td>
          <td>carbs</td>
          <td>total fat</td>
          <td>protein</td>
          <td></td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            calories ({authenticationService.currentUserValue.dailyCalories})
          </td>
          <td>carbs</td>
          <td>sugars</td>
          <td>total fat</td>
          <td>sat. fat</td>
          <td>cholesterol</td>
          <td>protein</td>
          <td>sodium</td>
          <td>potasium</td>
          <td>fiber</td>
          <td></td>
        </tr>
      );
    }
  }

  sumRow() {
    const {
      breakfast,
      lunch,
      dinner,
      snack,
      exercises,
      appOrCustomExercises,
    } = this.props;
    if (authenticationService.currentUserValue.role === "REGULAR") {
      return (
        <tr>
          <td colSpan="4">sum</td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "calories"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "carbs"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "totalFat"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "protein"
            )}
          </td>
          <td></td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td colSpan="4">sum</td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "calories"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "carbs"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "sugars"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "totalFat"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "saturatedFat"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "cholesterol"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "protein"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "sodium"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "potasium"
            )}
          </td>
          <td>
            {totalNutrient(
              breakfast,
              lunch,
              dinner,
              snack,
              exercises,
              appOrCustomExercises,
              "fiber"
            )}
          </td>
          <td></td>
        </tr>
      );
    }
  }
  render() {
    const isPremium =
      authenticationService.currentUserValue.role === Role.Premium;
    return (
      <table className={isPremium ? "premiumTable" : "regularTable"}>
        <tbody>
          {this.sumHeader()}
          {this.sumRow()}
        </tbody>
      </table>
    );
  }
}

Sum.propTypes = {
  breakfast: PropTypes.object.isRequired,
  lunch: PropTypes.object.isRequired,
  dinner: PropTypes.object.isRequired,
  snack: PropTypes.object.isRequired,
  exercises: PropTypes.array.isRequired,
  appOrCustomExercises: PropTypes.array.isRequired,
};

export default Sum;
