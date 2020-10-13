import React, { Component } from "react";
import { authenticationService } from "../../services/authentication.service";
import { authHeader } from "../../helpers/auth-header";
import { nutritionixHeader } from "../../helpers/nutritionix-header";
import { calcNutr, calcCustomNutr } from "../../helpers/calculators";
import { totalNutrientInRecipe } from "../../helpers/calculators";
import Food from "./Food";
import RecipeSearch from "./RecipeSearch";
import { validateNumber, validateNotEmpty } from "../../helpers/validations";

export class RecipePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createMode: true,
      searchType: "nutritionix",
      chosenFood: null,
      chosenAppOrCustomFood: null, //{}
      chosenFoodName: "",
      quantity: "",
      servingSize: null,
      name: "",
      directions: "",
      numberOfServings: "",
      chosenFoods: [],
      chosenNutritionixFoods: [],
      chosenRecipeId: null,
      errors: {},
    };
  }

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
    this.setState({ chosenAppOrCustomFood: food, chosenFoodName: food.name });
  };

  recipeClicked = (recipe) => {
    this.setState({
      //chosenRecipe: recipe,
      createMode: false,
      chosenRecipeId: recipe.id,
      name: recipe.name,
      directions: recipe.directions,
      numberOfServings: recipe.numberOfServings,
    });
    this.getAppOrCustomFoodsInRecipe(recipe.id);
    this.geNutritionixFoodsInRecipe(recipe.id);
  };

  changeState(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeNumber(e) {
    this.setState({ [e.target.name]: e.target.value });
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

  changeNotEmpty(e) {
    this.setState({ [e.target.name]: e.target.value });
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

  toggleCreateMode = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      createMode: true,
      name: "",
      directions: "",
      numberOfServings: "",
      chosenFoods: [],
      chosenNutritionixFoods: [],
      chosenRecipeId: null,
    });
  };

  getAppOrCustomFoodsInRecipe(recipeid) {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    return fetch(
      `http://localhost:8080/api/recipes/foods/${recipeid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          chosenFoods: [...data],
        });
      });
  }
  geNutritionixFoodsInRecipe(recipeid) {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    return fetch(
      `http://localhost:8080/api/recipes/nutritionixFoods/${recipeid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          chosenNutritionixFoods: [...data],
        });
      });
  }

  // emptyRecipe() {
  //   return {
  //     id: "",
  //     username: authenticationService.currentUserValue.username,
  //     name: "",
  //     directions: "",
  //     foods: [],
  //     nutritionixFoods: [],
  //   };
  // }

  addFood(e) {
    e.preventDefault();
    if (this.state.searchType === "nutritionix") {
      this.addNutritionixFood();
    }
    if (
      this.state.searchType === "appFoods" ||
      this.state.searchType === "customFoods"
    ) {
      this.addAppOrCustomFoods();
    }
  }

  addNutritionixFood() {
    const serving = JSON.parse(this.state.servingSize);
    const measure = serving.measure;
    const base =
      (measure.serving_weight / this.state.chosenFood.serving_weight_grams) *
      this.state.quantity;
    this.setState({
      chosenNutritionixFoods: [
        ...this.state.chosenNutritionixFoods,
        {
          quantity: this.state.quantity,
          servingSize: measure.measure,
          name: this.state.chosenFoodName,
          servingWeight: Number(
            (measure.serving_weight * this.state.quantity).toFixed(2)
          ),
          calories: calcNutr("calories", base, this.state.chosenFood),
          carbs: calcNutr("carbs", base, this.state.chosenFood),
          protein: calcNutr("protein", base, this.state.chosenFood),
          totalFat: calcNutr("totalFat", base, this.state.chosenFood),
          saturatedFat: calcNutr("saturatedFat", base, this.state.chosenFood),
          cholesterol: calcNutr("cholesterol", base, this.state.chosenFood),
          sodium: calcNutr("sodium", base, this.state.chosenFood),
          fiber: calcNutr("fiber", base, this.state.chosenFood),
          sugars: calcNutr("sugars", base, this.state.chosenFood),
          potasium: calcNutr("potasium", base, this.state.chosenFood),
        },
      ],
    });
  }

  addAppOrCustomFoods() {
    const food = this.state.chosenAppOrCustomFood;
    const base = this.state.quantity / 100;
    this.setState({
      chosenFoods: [
        ...this.state.chosenFoods,
        {
          id: "",
          quantity: this.state.quantity,
          servingSize: "grams",
          foodId: food.id,
          name: food.name,
          servingWeight: this.state.quantity,
          calories: calcCustomNutr("calories", base, food),
          carbs: calcCustomNutr("carbs", base, food),
          protein: calcCustomNutr("protein", base, food),
          totalFat: calcCustomNutr("totalFat", base, food),
          saturatedFat: calcCustomNutr("saturatedFat", base, food),
          cholesterol: calcCustomNutr("cholesterol", base, food),
          sodium: calcCustomNutr("sodium", base, food),
          fiber: calcCustomNutr("fiber", base, food),
          sugars: calcCustomNutr("sugars", base, food),
          potasium: calcCustomNutr("potasium", base, food),
        },
      ],
    });
  }

  saveRecipe(e) {
    const {
      name,
      directions,
      numberOfServings,
      chosenFoods,
      chosenNutritionixFoods,
    } = this.state;
    e.preventDefault();
    const newRecipe = {
      username: authenticationService.currentUserValue.username,
      name: name,
      directions: directions,
      numberOfServings: numberOfServings,
      foods: [...chosenFoods],
      nutritionixFoods: [...chosenNutritionixFoods],
      servingWeight: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "servingWeight"
      ),
      calories: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "calories"
      ),
      carbs: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "carbs"
      ),
      sugars: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "sugars"
      ),
      totalFat: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "totalFat"
      ),
      saturatedFat: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "saturatedFat"
      ),
      cholesterol: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "cholesterol"
      ),
      protein: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "protein"
      ),
      sodium: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "sodium"
      ),
      potasium: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "potasium"
      ),
      fiber: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "fiber"
      ),
    };
    const requestOptions = {
      method: "POST",
      headers: authHeader("POST"),
      body: JSON.stringify(newRecipe),
    };
    fetch(`http://localhost:8080/api/recipes`, requestOptions).then(
      (response) => {
        alert("Recipe has been saved!");
        this.setState({
          name: "",
          directions: "",
          numberOfServings: "",
          chosenFoods: [],
          chosenNutritionixFoods: [],
        });
      }
    );
  }

  updateRecipe(e) {
    const {
      chosenRecipeId,
      name,
      directions,
      numberOfServings,
      chosenFoods,
      chosenNutritionixFoods,
    } = this.state;
    e.preventDefault();
    const updatedRecipe = {
      id: chosenRecipeId,
      name: name,
      directions: directions,
      numberOfServings: numberOfServings,
      foods: [...chosenFoods],
      nutritionixFoods: [...chosenNutritionixFoods],
      servingWeight: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "servingWeight"
      ),
      calories: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "calories"
      ),
      carbs: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "carbs"
      ),
      sugars: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "sugars"
      ),
      totalFat: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "totalFat"
      ),
      saturatedFat: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "saturatedFat"
      ),
      cholesterol: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "cholesterol"
      ),
      protein: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "protein"
      ),
      sodium: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "sodium"
      ),
      potasium: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "potasium"
      ),
      fiber: totalNutrientInRecipe(
        chosenNutritionixFoods,
        chosenFoods,
        "fiber"
      ),
    };
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(updatedRecipe),
    };
    fetch(
      `http://localhost:8080/api/recipes`,
      requestOptions
    ).then((response) => alert("Recipe has been updated!"));
  }

  removeChosenFood(food) {
    if (food.foodId === undefined) {
      this.setState({
        chosenNutritionixFoods: [
          ...this.state.chosenNutritionixFoods.filter(
            (f) => f.name !== food.name
          ),
        ],
      });
    } else {
      this.setState({
        chosenFoods: [
          ...this.state.chosenFoods.filter((f) => f.foodId !== food.foodId),
        ],
      });
    }
  }

  deleteRecipe(e) {
    e.preventDefault();
    const { chosenRecipeId } = this.state;
    if (window.confirm("Are you sure?")) {
      const requestOptions = {
        method: "DELETE",
        headers: authHeader("DELETE"),
      };
      return fetch(
        `http://localhost:8080/api/recipes/${chosenRecipeId}`,
        requestOptions
      ).then((response) => {
        alert("Recipe has been deleted!");
        this.toggleCreateMode();
      });
    }
  }

  removeNutritionixFood = (id) => {
    if (id) {
      console.log("IF id removeNutritionixFood, id: " + id);
      //console.log("IF id removeNutritionixFood, food name: " + foodName);
      const requestOptions = {
        method: "DELETE",
        headers: authHeader("DELETE"),
      };
      fetch(
        `http://localhost:8080/api/recipes/deleteNutritionixFood/${id}`,
        requestOptions
      ).then(
        this.setState({
          chosenNutritionixFoods: [
            ...this.state.chosenNutritionixFoods.filter((f) => f.id !== id),
          ],
        })
      );
    } else {
      console.log("ELSE id removeNutritionixFood, id: " + id);
      //console.log("ELSE id removeNutritionixFood, food name: " + foodName);
      // console.log("removeNutritionixFood, Json food: " + JSON.stringify(food));
    }
  };

  removeAppOrCustomFood = (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: authHeader("DELETE"),
    };
    fetch(
      `http://localhost:8080/api/recipes/deleteFood/${id}`,
      requestOptions
    ).then(
      this.setState({
        chosenFoods: [...this.state.chosenFoods.filter((f) => f.id !== id)],
      })
    );
  };

  isAddFoodDisabled() {
    const { errors } = this.state;
    if (
      errors.quantity ||
      errors.servingSize ||
      this.state.quantity === "" ||
      this.state.servingSize === null ||
      (this.state.chosenFood === null &&
        this.state.chosenAppOrCustomFood === null)
    ) {
      return true;
    } else {
      return false;
    }
  }

  isSaveRecipeDisabled() {
    const {
      errors,
      name,
      numberOfServings,
      chosenFoods,
      chosenNutritionixFoods,
    } = this.state;
    if (
      errors.name ||
      errors.numberOfServings ||
      name === "" ||
      numberOfServings === "" ||
      (chosenFoods.length === 0 && chosenNutritionixFoods.length === 0)
    ) {
      return true;
    } else {
      return false;
    }
  }

  style = {
    directions: {
      border: "1px solid gray",
      borderRadius: "6px",
      color: "rgb(100, 99, 99)",
    },
    form: {
      marginTop: "15px",
      // display: "inline",
      // float: "right",
    },
    basicBtn: {
      padding: "3px",
      backgroundColor: "gray",
      border: "1px solid white",
      color: "white",
      borderRadius: "6px",
    },
    // saveRecipeBtn: {
    //   marginTop: "10px",
    //   padding: "5px",
    //   backgroundColor: "gray",
    //   fontWeight: "bold",
    //   border: "1px solid white",
    //   color: "white",
    //   borderRadius: "6px",
    // },
    wrapperToCenter: {
      textAlign: "center",
    },
    h4: {
      //display: "inline",
    },
    // inputContainer: {
    //   width: "100%",
    //   height: "120px",
    //   //position: "absolute",
    // },
    // leftInputs: {
    //   width: "25%",
    //   height: "100%",
    //   float: "left",
    // },
    // rightInputs: {
    //   width: "75%",
    //   height: "100%",
    //   float: "right",
    // },
  };

  render() {
    return (
      <div className="myContainer">
        <div className="searchResults">
          <select
            className="searchTypeSelect"
            name="searchType"
            onChange={(e) => this.changeState(e)}
          >
            <option value="nutritionix">nutritionIX foods</option>
            <option value="appFoods">app foods</option>
            <option value="customFoods">custom foods</option>
            <option value="recipesToEdit">recipes to edit</option>
          </select>
          <RecipeSearch
            searchType={this.state.searchType}
            foodClicked={this.foodClicked}
            appOrCustomFoodClicked={this.appOrCustomFoodClicked}
            recipeClicked={this.recipeClicked}
          ></RecipeSearch>
        </div>
        <div className="workspace">
          {this.state.createMode && <h4>Create new recipe</h4>}
          {!this.state.createMode && (
            <React.Fragment>
              <h4>Edit chosen recipe</h4>
              <button
                className="smallWhiteBtn"
                onClick={(e) => this.toggleCreateMode(e)}
              >
                Create new recipe
              </button>
            </React.Fragment>
          )}
          <br />
          <label htmlFor="name">Name* </label>
          <input
            className={
              this.state.errors.name ? "errorBasicInput" : "basicInput"
            }
            type="text"
            name="name"
            value={this.state.name}
            onChange={(e) => this.changeNotEmpty(e)}
            required
          />
          <br />
          <label htmlFor="numberOfServings">Number of servings* </label>
          <input
            className={
              this.state.errors.numberOfServings
                ? "errorSmallInput"
                : "smallInput"
            }
            type="text"
            name="numberOfServings"
            value={this.state.numberOfServings}
            onChange={(e) => this.changeNumber(e)}
            required
          />
          <br />
          <label htmlFor="directions">Directions </label>
          <br />
          <textarea
            style={this.style.directions}
            rows="2"
            cols="30"
            maxlength="254"
            type="text"
            name="directions"
            value={this.state.directions}
            onChange={(e) => this.changeState(e)}
          />
          <br />
          <h4 style={this.style.h4}>Ingredients</h4>
          <form onSubmit={(e) => this.addFood(e)} style={this.style.form}>
            <input
              className="basicInput"
              type="text"
              name="chosenFoodName"
              value={this.state.chosenFoodName}
              placeholder="chosen food"
              readOnly
            />
            <input
              className={
                this.state.errors.quantity ? "errorSmallInput" : "smallInput"
              }
              type="text"
              name="quantity"
              placeholder="amount"
              onChange={(e) => this.changeNumber(e)}
            />
            <select
              className="basicInput"
              name="servingSize"
              onChange={(e) => this.changeNotEmpty(e)}
            >
              {this.state.chosenFood &&
                this.state.searchType === "nutritionix" &&
                this.state.chosenFood.alt_measures.map((measure) => {
                  return (
                    <option value={JSON.stringify({ measure })}>
                      {measure.measure}
                    </option>
                  );
                })}
              {this.state.chosenAppOrCustomFood &&
                (this.state.searchType === "appFoods" ||
                  this.state.searchType === "customFoods") && (
                  <React.Fragment>
                    <option value="">select serving size</option>
                    <option value="g">g</option>{" "}
                  </React.Fragment>
                )}
              {!this.state.chosenFood && !this.state.chosenAppOrCustomFood && (
                <option value="">serving size</option>
              )}
            </select>
            <button
              className="smallWhiteBtn"
              disabled={this.isAddFoodDisabled()}
              type="submit"
            >
              Add ingredient
            </button>
          </form>
          <Food
            chosenFoods={this.state.chosenFoods}
            chosenNutritionixFoods={this.state.chosenNutritionixFoods}
            removeNutritionixFood={this.removeNutritionixFood}
            removeAppOrCustomFood={this.removeAppOrCustomFood}
          ></Food>
          {this.state.createMode && (
            <div style={this.style.wrapperToCenter}>
              <button
                className="whiteBtn"
                disabled={this.isSaveRecipeDisabled()}
                onClick={(e) => this.saveRecipe(e)}
              >
                Save recipe
              </button>
            </div>
          )}
          {!this.state.createMode && (
            <React.Fragment>
              <button
                className="whiteBtn"
                disabled={this.isSaveRecipeDisabled()}
                onClick={(e) => this.updateRecipe(e)}
              >
                Update recipe
              </button>
              <button
                className="whiteBtn"
                disabled={this.isSaveRecipeDisabled()}
                onClick={(e) => this.deleteRecipe(e)}
              >
                Delete recipe
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default RecipePage;
