import React, { Component } from "react";
import { authHeader } from "../../helpers/auth-header";
import { nutritionixHeader } from "../../helpers/nutritionix-header";
import { authenticationService } from "../../services/authentication.service";
import PropTypes from "prop-types";

export class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commonFoods: [],
      brandedFoods: [],
      appFoods: [],
      customFoods: [],
      recipes: [],
      appExercises: [],
      customExercises: [],
    };
  }

  changeSearch(e) {
    const query = e.target.value;
    if (this.props.searchType === "nutritionix" && query !== "") {
      this.searchNutritionixFoods(query);
    }
    if (this.props.searchType === "appFoods" && query !== "") {
      this.searchAppFoods(query);
    }
    if (this.props.searchType === "customFoods" && query !== "") {
      this.searchCustomFoods(query);
    }
    if (this.props.searchType === "recipes" && query !== "") {
      this.searchRecipes(query);
    }
    if (this.props.searchType === "appExercises" && query !== "") {
      this.searchAppExercises(query);
    }
    if (this.props.searchType === "customExercises" && query !== "") {
      this.searchCustomExercises(query);
    }
  }

  searchNutritionixFoods(query) {
    const requestOptions = { method: "GET", headers: nutritionixHeader("GET") };
    return fetch(
      `https://trackapi.nutritionix.com/v2/search/instant?query=${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          commonFoods: data.common,
          brandedFoods: data.branded,
        });
      });
  }

  searchAppFoods(query) {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    return fetch(
      `http://localhost:8080/api/foods/admin?query=${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          appFoods: data,
        });
      });
  }

  searchCustomFoods(query) {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    return fetch(
      `http://localhost:8080/api/foods/${authenticationService.currentUserValue.username}?query=${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          customFoods: data,
        });
      });
  }

  searchRecipes(query) {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    return fetch(
      `http://localhost:8080/api/recipes/search/${authenticationService.currentUserValue.username}?query=${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          recipes: data,
        });
      });
  }

  searchAppExercises(query) {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    return fetch(
      `http://localhost:8080/api/exercises/admin?query=${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          appExercises: data,
        });
      });
  }

  searchCustomExercises(query) {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    return fetch(
      `http://localhost:8080/api/exercises/${authenticationService.currentUserValue.username}?query=${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          customExercises: data,
        });
      });
  }
  render() {
    const {
      commonFoods,
      brandedFoods,
      appFoods,
      customFoods,
      recipes,
      appExercises,
      customExercises,
    } = this.state;
    return (
      <React.Fragment>
        <input
          className="searchInput"
          type="text"
          placeholder="type something to search..."
          onChange={(e) => this.changeSearch(e)}
        />
        {this.props.searchType === "nutritionix" && (
          <div>
            {commonFoods.map((food) => (
              <React.Fragment>
                <button
                  className="searchResultBtn"
                  onClick={(e) => this.props.foodClicked(food.food_name)}
                >
                  {food.food_name}
                </button>
                <br />
              </React.Fragment>
            ))}
          </div>
        )}
        {this.props.searchType === "nutritionix" && (
          <div>
            {brandedFoods.map((food) => (
              <React.Fragment>
                <button
                  className="searchResultBtn"
                  onClick={(e) => this.props.foodClicked(food.food_name)}
                >
                  {food.food_name}
                </button>
                <br />
              </React.Fragment>
            ))}
          </div>
        )}
        {this.props.searchType === "appFoods" && (
          <div>
            {appFoods.map((food) => (
              <React.Fragment>
                <button
                  className="searchResultBtn"
                  onClick={(e) => this.props.appOrCustomFoodClicked(food)}
                >
                  {food.name}
                </button>
                <br />
              </React.Fragment>
            ))}
          </div>
        )}
        {this.props.searchType === "customFoods" && (
          <div>
            {customFoods.map((food) => (
              <React.Fragment>
                <button
                  className="searchResultBtn"
                  onClick={(e) => this.props.appOrCustomFoodClicked(food)}
                >
                  {food.name}
                </button>
                <br />
              </React.Fragment>
            ))}
          </div>
        )}
        {this.props.searchType === "recipes" && (
          <div>
            {recipes.map((recipe) => (
              <React.Fragment>
                <button
                  className="searchResultBtn"
                  onClick={(e) => this.props.recipeClicked(recipe)}
                >
                  {recipe.name}
                </button>
                <br />
              </React.Fragment>
            ))}
          </div>
        )}
        {this.props.searchType === "appExercises" && (
          <div>
            {appExercises.map((exercise) => (
              <React.Fragment>
                <button
                  className="searchResultBtn"
                  onClick={(e) =>
                    this.props.appOrCustomExerciseClicked(exercise)
                  }
                >
                  {exercise.name}
                </button>
                <br />
              </React.Fragment>
            ))}
          </div>
        )}
        {this.props.searchType === "customExercises" && (
          <div>
            {customExercises.map((exercise) => (
              <React.Fragment>
                <button
                  className="searchResultBtn"
                  onClick={(e) =>
                    this.props.appOrCustomExerciseClicked(exercise)
                  }
                >
                  {exercise.name}
                </button>
                <br />
              </React.Fragment>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  }
}

Search.propTypes = {
  searchType: PropTypes.string.isRequired,
  foodClicked: PropTypes.func.isRequired,
  appOrCustomFoodClicked: PropTypes.func.isRequired,
  recipeClicked: PropTypes.func.isRequired,
  appOrCustomExerciseClicked: PropTypes.func.isRequired,
};

export default Search;
