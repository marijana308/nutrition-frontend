import React, { Component } from "react";
import "../../css/style.css";
import { nutritionixHeader } from "../../helpers/nutritionix-header";
import Search from "./DashboardSearch";
import DashboardWorkspace from "./DashboardWorkspace";

export class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenFoodName: "",
      chosenFood: null,
      chosenAppOrCustomFood: null,
      chosenRecipe: null,
      chosenAppOrCustomExercise: { name: "" },
      searchType: "nutritionix",
    };
  }

  change = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  foodClicked = (foodName) => {
    const requestOptions = {
      method: "POST",
      headers: nutritionixHeader("POST"),
      body: JSON.stringify({ query: foodName }),
    };
    fetch(
      `https://trackapi.nutritionix.com/v2/natural/nutrients`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({ chosenFoodName: foodName, chosenFood: data.foods[0] });
      });
  };

  appOrCustomFoodClicked = (food) => {
    this.setState({ chosenFoodName: food.name, chosenAppOrCustomFood: food });
  };

  recipeClicked = (recipe) => {
    this.setState({ chosenFoodName: recipe.name, chosenRecipe: recipe });
  };

  appOrCustomExerciseClicked = (exercise) => {
    this.setState({
      chosenAppOrCustomExercise: exercise,
    });
  };

  render() {
    const {
      chosenFoodName,
      chosenFood,
      chosenAppOrCustomFood,
      chosenRecipe,
      searchType,
      chosenAppOrCustomExercise,
    } = this.state;
    return (
      <div className="myContainer">
        <div className="searchResults">
          <select
            className="searchTypeSelect"
            name="searchType"
            onChange={(e) => this.change(e)}
          >
            <option value="nutritionix">nutritionIX foods</option>
            <option value="appFoods">app foods</option>
            <option value="customFoods">custom foods</option>
            <option value="recipes">custom recipes</option>
            <option value="appExercises">app exercises</option>
            <option value="customExercises">custom exercises</option>
          </select>
          <Search
            searchType={searchType}
            foodClicked={this.foodClicked}
            appOrCustomFoodClicked={this.appOrCustomFoodClicked}
            recipeClicked={this.recipeClicked}
            appOrCustomExerciseClicked={this.appOrCustomExerciseClicked}
          ></Search>
        </div>
        <div className="workspace">
          <DashboardWorkspace
            chosenFoodName={chosenFoodName}
            chosenFood={chosenFood}
            chosenAppOrCustomFood={chosenAppOrCustomFood}
            chosenRecipe={chosenRecipe}
            chosenAppOrCustomExercise={chosenAppOrCustomExercise}
            searchType={searchType}
          ></DashboardWorkspace>
        </div>
      </div>
    );
  }
}

export default DashboardPage;
