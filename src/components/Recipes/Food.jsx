import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { Role } from "../../helpers/role";

export class Food extends Component {
  tableHeader() {
    if (authenticationService.currentUserValue.role === Role.User) {
      return (
        <tr>
          <td>food</td>
          <td>amount</td>
          <td>serving size</td>
          <td>serving weight</td>
          <td>calories</td>
          <td>carbs</td>
          <td>total fat</td>
          <td>protein</td>
          <td></td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>food</td>
          <td>amount</td>
          <td>serving size</td>
          <td>serving weight</td>
          <td>calories</td>
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

  foodRow(foods, nutritionix) {
    let key = 0;
    if (
      foods.length > 0 &&
      authenticationService.currentUserValue.role === Role.Premium
    ) {
      return foods.map((food) => (
        <tr key={key + 1}>
          <td>{food.name}</td>
          <td>{food.quantity}</td>
          <td>{food.servingSize}</td>
          <td>{food.servingWeight}</td>
          <td>{food.calories}</td>
          <td>{food.carbs}</td>
          <td>{food.sugars}</td>
          <td>{food.totalFat}</td>
          <td>{food.saturatedFat}</td>
          <td>{food.cholesterol}</td>
          <td>{food.protein}</td>
          <td>{food.sodium}</td>
          <td>{food.potasium}</td>
          <td>{food.fiber}</td>
          <td>
            {nutritionix && (
              <button
                onClick={this.props.removeNutritionixFood.bind(this, food.id)}
              >
                x
              </button>
            )}
            {!nutritionix && (
              <button
                onClick={this.props.removeAppOrCustomFood.bind(this, food.id)}
              >
                x
              </button>
            )}
          </td>
        </tr>
      ));
    }
    if (
      foods.length > 0 &&
      authenticationService.currentUserValue.role === Role.User
    ) {
      return foods.map((food) => (
        <tr>
          <td>{food.name}</td>
          <td>{food.quantity}</td>
          <td>{food.servingSize}</td>
          <td>{food.servingWeight}</td>
          <td>{food.calories}</td>
          <td>{food.carbs}</td>
          <td>{food.totalFat}</td>
          <td>{food.protein}</td>
          <td>
            {nutritionix && (
              <button
                onClick={this.props.removeNutritionixFood.bind(this, food.id)}
              >
                x
              </button>
            )}
            {!nutritionix && (
              <button
                onClick={this.props.removeAppOrCustomFood.bind(this, food.id)}
              >
                x
              </button>
            )}
          </td>
        </tr>
      ));
    }
  }
  render() {
    const isPremium =
      authenticationService.currentUserValue.role === Role.Premium;
    return (
      <table className={isPremium ? "premiumTable" : "regularTable"}>
        {this.tableHeader()}
        {this.props.chosenFoods.length < 1 &&
          this.props.chosenNutritionixFoods.length < 1 && (
            <tr>
              <td colSpan="14">Add foods</td>
            </tr>
          )}
        {this.foodRow(this.props.chosenNutritionixFoods, true)}
        {this.foodRow(this.props.chosenFoods, false)}
      </table>
    );
  }
}

Food.propTypes = {
  chosenFoods: PropTypes.array.isRequired,
  chosenNutritionixFoods: PropTypes.array.isRequired,
  removeNutritionixFood: PropTypes.func.isRequired,
  removeAppOrCustomFood: PropTypes.func.isRequired,
};

export default Food;
