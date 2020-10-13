import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { Role } from "../../helpers/role";

export class Meal extends Component {
  tableHeader() {
    if (authenticationService.currentUserValue.role === "REGULAR") {
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

  emptyRow(meal) {
    return (
      meal.chosenFoods.length < 1 &&
      meal.appOrCustomFoods.length < 1 &&
      meal.recipes.length < 1 && (
        <tr>
          <td colSpan="15">Add foods</td>
        </tr>
      )
    );
  }

  foodRow(foods, foodType) {
    if (
      foods.length > 0 &&
      authenticationService.currentUserValue.role === "REGULAR"
    ) {
      return foods.map((food) => (
        <tr key={food.id}>
          <td>{food.name}</td>
          <td>{food.quantity}</td>
          <td>{food.servingSize}</td>
          <td>{food.servingWeight}</td>
          <td>{food.calories}</td>
          <td>{food.carbs}</td>
          <td>{food.totalFat}</td>
          <td>{food.protein}</td>
          <td>
            {foodType === "nutritionix" && (
              <button
                onClick={this.props.removeNutritionixFood.bind(this, food.id)}
                className="deleteBtn"
              >
                x
              </button>
            )}
            {foodType === "appOrCustomFood" && (
              <button
                onClick={this.props.removeAppOrCustomFood.bind(this, food.id)}
                className="deleteBtn"
              >
                x
              </button>
            )}
            {foodType === "recipe" && (
              <button
                onClick={this.props.removeRecipe.bind(this, food.id)}
                className="deleteBtn"
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
      authenticationService.currentUserValue.role === "PREMIUM"
    ) {
      return foods.map((food) => (
        <tr key={food.id}>
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
            {foodType === "nutritionix" && (
              <button
                onClick={this.props.removeNutritionixFood.bind(this, food.id)}
                className="deleteBtn"
              >
                x
              </button>
            )}
            {foodType === "appOrCustomFood" && (
              <button
                onClick={this.props.removeAppOrCustomFood.bind(this, food.id)}
                className="deleteBtn"
              >
                x
              </button>
            )}
            {foodType === "recipe" && (
              <button
                onClick={this.props.removeRecipe.bind(this, food.id)}
                className="deleteBtn"
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
    const { foods } = this.props;
    const isPremium =
      authenticationService.currentUserValue.role === Role.Premium;
    return (
      <table className={isPremium ? "premiumTable" : "regularTable"}>
        <tbody>
          {this.tableHeader()}
          {this.emptyRow(foods)}
          {this.foodRow(foods.chosenFoods, "nutritionix")}
          {this.foodRow(foods.appOrCustomFoods, "appOrCustomFood")}
          {this.foodRow(foods.recipes, "recipe")}
        </tbody>
      </table>
    );
  }
}

Meal.propTypes = {
  mealType: PropTypes.string,
  foods: PropTypes.object.isRequired,
  removeNutritionixFood: PropTypes.func.isRequired,
  removeAppOrCustomFood: PropTypes.func.isRequired,
  removeRecipe: PropTypes.func.isRequired,
};

export default Meal;
