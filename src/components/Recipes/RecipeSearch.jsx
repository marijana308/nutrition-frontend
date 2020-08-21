import React, { Component } from "react";
import PropTypes from "prop-types";
import { nutritionixHeader } from "../../helpers/nutritionix-header";
import { authHeader } from "../../helpers/auth-header";
import { authenticationService } from "../../services/authentication.service";

export class RecipeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commonFoods: [],
      brandedFoods: [],
      appFoods: [],
      customFoods: [],
      usersRecipes: [],
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
    if (this.props.searchType === "recipesToEdit" && query !== "") {
      this.showRecipesToEdit(query);
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

  showRecipesToEdit(query) {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    return fetch(
      `http://localhost:8080/api/recipes/search/${authenticationService.currentUserValue.username}?query=${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          usersRecipes: [...data],
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        <input
          className="searchInput"
          type="text"
          placeholder="search..."
          onChange={(e) => this.changeSearch(e)}
        />
        <br />
        {this.props.searchType === "nutritionix" && (
          <React.Fragment>
            {this.state.commonFoods.map((food) => (
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
          </React.Fragment>
        )}
        {this.props.searchType === "nutritionix" && (
          <React.Fragment>
            {this.state.brandedFoods.map((food) => (
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
          </React.Fragment>
        )}
        {this.props.searchType === "appFoods" && (
          <React.Fragment>
            {this.state.appFoods.map((food) => (
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
          </React.Fragment>
        )}
        {this.props.searchType === "customFoods" && (
          <React.Fragment>
            {this.state.customFoods.map((food) => (
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
          </React.Fragment>
        )}
        {this.props.searchType === "recipesToEdit" && (
          <React.Fragment>
            {this.state.usersRecipes.map((recipe) => (
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
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
RecipeSearch.propTypes = {
  searchType: PropTypes.string,
  foodClicked: PropTypes.func,
  appOrCustomFoodClicked: PropTypes.func,
  recipeClicked: PropTypes.func,
};

export default RecipeSearch;
