import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { authHeader } from "../../helpers/auth-header";
import { nutritionixHeader } from "../../helpers/nutritionix-header";
import { calcNutr, calcCustomNutr } from "../../helpers/calculators";
import { Meal } from "./Meal";
import { Exercises } from "./Exercises";
import { Sum } from "./Sum";
import { validateNumber, validateNotEmpty } from "../../helpers/validations";
//http://localhost:8080/api/recipes/meal
export class DashboardWorkspace extends Component {
  getCurrentDate() {
    return new Date().toJSON().slice(0, 10);
  }
  constructor(props) {
    super(props);
    this.state = {
      dayid: null,
      quantity: "",
      servingSize: null,
      mealType: "",
      date: this.getCurrentDate(),
      totalWaterIntake: "",
      exercise: null, //nutritionix exercise query
      exerciseTime: "",
      exercises: [],
      appOrCustomExercises: [],
      breakfast: {
        id: null,
        chosenFoods: [],
        appOrCustomFoods: [],
        recipes: [],
      },
      lunch: { id: null, chosenFoods: [], appOrCustomFoods: [], recipes: [] },
      dinner: { id: null, chosenFoods: [], appOrCustomFoods: [], recipes: [] },
      snack: { id: null, chosenFoods: [], appOrCustomFoods: [], recipes: [] },
      errors: [],
    };
  }

  componentDidMount() {
    this.getDay(this.getCurrentDate());
  }

  change(e) {
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

  changeSelect(e) {
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
          [e.target.name]: "Must select something",
        },
      });
    }
  }

  isAddFoodDisabled() {
    const { errors } = this.state;
    if (errors.quantity || errors.servingSize || errors.mealType) {
      return true;
    } else {
      return false;
    }
  }

  isAddExerciseDisabled() {
    const { errors } = this.state;
    const { searchType, chosenAppOrCustomExercise } = this.props;
    if (
      (searchType === "appExercises" || searchType === "customExercises") &&
      chosenAppOrCustomExercise &&
      errors.exerciseTime
    ) {
      return true;
    } else {
      return false;
    }
  }

  isAddNutritionixExerciseDisabled() {
    if (this.state.exercise && this.state.exercise !== "") {
      return false;
    } else {
      return true;
    }
  }

  changeDate(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.getDay(e.target.value);
  }

  getDay(date) {
    const day = {
      username: authenticationService.currentUserValue.username,
      date: date,
    };
    const requestOptions = {
      method: "POST",
      headers: authHeader("POST"),
      body: JSON.stringify(day),
    };
    fetch(`http://localhost:8080/api/days/date`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.id === null) {
          this.setState({
            dayid: null,
            totalWaterIntake: "",
            exercises: [],
            appOrCustomExercises: [],
            breakfast: {
              chosenFoods: [],
              appOrCustomFoods: [],
              recipes: [],
            },
            lunch: { chosenFoods: [], appOrCustomFoods: [], recipes: [] },
            dinner: { chosenFoods: [], appOrCustomFoods: [], recipes: [] },
            snack: { chosenFoods: [], appOrCustomFoods: [], recipes: [] },
          });
        } else {
          this.setState({
            dayid: data.id,
            totalWaterIntake: data.totalWaterIntake || "",
          });
          this.getMealsByDayId(data.id);
          this.getNutritionixExercisesByDayId(data.id);
          this.getExercisesByDayId(data.id);
        }
      });
  }

  getMealsByDayId(dayid) {
    this.setState({
      breakfast: {
        chosenFoods: [],
        appOrCustomFoods: [],
        recipes: [],
      },
      lunch: { chosenFoods: [], appOrCustomFoods: [], recipes: [] },
      dinner: { chosenFoods: [], appOrCustomFoods: [], recipes: [] },
      snack: { chosenFoods: [], appOrCustomFoods: [], recipes: [] },
    });
    const requestOptions = {
      method: "GET",
      headers: authHeader("GET"),
    };
    fetch(`http://localhost:8080/api/meals/${dayid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("getMealsByDayId, meals= " + JSON.stringify(data));
        data.map((meal) => {
          this.getNutritionixFoodsByMealId(meal.id, meal.mealType);
          this.getAppFoodsByMealId(meal.id, meal.mealType);
          this.getRecipesByMealId(meal.id, meal.mealType);
        });
      });
  }

  getNutritionixExercisesByDayId(dayid) {
    this.setState({ exercises: [] });
    const requestOptions = {
      method: "GET",
      headers: authHeader("GET"),
    };
    fetch(
      `http://localhost:8080/api/exercises/nutritionix/day/${dayid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        data.map((exercise) => {
          this.addExercise(exercise.exerciseQuery, exercise.id);
        });
      });
  }

  getExercisesByDayId(dayid) {
    this.setState({ appOrCustomExercises: [] });
    const requestOptions = {
      method: "GET",
      headers: authHeader("GET"),
    };
    fetch(`http://localhost:8080/api/exercises/day/${dayid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ appOrCustomExercises: [...data] });
      });
  }

  getNutritionixFoodsByMealId(mealid, mealType) {
    const requestOptions = {
      method: "GET",
      headers: authHeader("GET"),
    };
    fetch(
      `http://localhost:8080/api/foods/nutritionix/meal/${mealid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (mealType === "BREAKFAST") {
          this.setState({
            breakfast: {
              id: mealid,
              chosenFoods: [...data],
              appOrCustomFoods: [...this.state.breakfast.appOrCustomFoods],
              recipes: [...this.state.breakfast.recipes],
            },
          });
        }
        if (mealType === "LUNCH") {
          this.setState({
            lunch: {
              id: mealid,
              chosenFoods: [...data],
              appOrCustomFoods: [...this.state.lunch.appOrCustomFoods],
              recipes: [...this.state.lunch.recipes],
            },
          });
        }
        if (mealType === "DINNER") {
          this.setState({
            dinner: {
              id: mealid,
              chosenFoods: [...data],
              appOrCustomFoods: [...this.state.dinner.appOrCustomFoods],
              recipes: [...this.state.dinner.recipes],
            },
          });
        }
        if (mealType === "SNACK") {
          this.setState({
            snack: {
              id: mealid,
              chosenFoods: [...data],
              appOrCustomFoods: [...this.state.snack.appOrCustomFoods],
              recipes: [...this.state.snack.recipes],
            },
          });
        }
      });
  }

  getAppFoodsByMealId(mealid, mealType) {
    const requestOptions = {
      method: "GET",
      headers: authHeader("GET"),
    };
    fetch(`http://localhost:8080/api/foods/meal/${mealid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (mealType === "BREAKFAST") {
          this.setState({
            breakfast: {
              id: mealid,
              chosenFoods: [...this.state.breakfast.chosenFoods],
              appOrCustomFoods: [...data],
              recipes: [...this.state.breakfast.recipes],
            },
          });
        }
        if (mealType === "LUNCH") {
          this.setState({
            lunch: {
              id: mealid,
              chosenFoods: [...this.state.lunch.chosenFoods],
              appOrCustomFoods: [...data],
              recipes: [...this.state.lunch.recipes],
            },
          });
        }
        if (mealType === "DINNER") {
          this.setState({
            dinner: {
              id: mealid,
              chosenFoods: [...this.state.dinner.chosenFoods],
              appOrCustomFoods: [...data],
              recipes: [...this.state.dinner.recipes],
            },
          });
        }
        if (mealType === "SNACK") {
          this.setState({
            snack: {
              id: mealid,
              chosenFoods: [...this.state.snack.chosenFoods],
              appOrCustomFoods: [...data],
              recipes: [...this.state.snack.recipes],
            },
          });
        }
      });
  }

  getRecipesByMealId(mealid, mealType) {
    const requestOptions = {
      method: "GET",
      headers: authHeader("GET"),
    };
    fetch(`http://localhost:8080/api/recipes/meal/${mealid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (mealType === "BREAKFAST") {
          this.setState({
            breakfast: {
              id: mealid,
              chosenFoods: [...this.state.breakfast.chosenFoods],
              appOrCustomFoods: [...this.state.breakfast.appOrCustomFoods],
              recipes: [...data],
            },
          });
        }
        if (mealType === "LUNCH") {
          this.setState({
            lunch: {
              id: mealid,
              chosenFoods: [...this.state.lunch.chosenFoods],
              appOrCustomFoods: [...this.state.lunch.appOrCustomFoods],
              recipes: [...data],
            },
          });
        }
        if (mealType === "DINNER") {
          this.setState({
            dinner: {
              id: mealid,
              chosenFoods: [...this.state.dinner.chosenFoods],
              appOrCustomFoods: [...this.state.dinner.appOrCustomFoods],
              recipes: [...data],
            },
          });
        }
        if (mealType === "SNACK") {
          this.setState({
            snack: {
              id: mealid,
              chosenFoods: [...this.state.snack.chosenFoods],
              appOrCustomFoods: [...this.state.snack.appOrCustomFoods],
              recipes: [...data],
            },
          });
        }
      });
  }

  addFood(e) {
    e.preventDefault();
    if (this.props.searchType === "nutritionix") {
      this.addNutritionixFoodToMeal();
    }
    if (
      this.props.searchType === "appFoods" ||
      this.props.searchType === "customFoods"
    ) {
      this.addFoodToMeal();
    }
    if (this.props.searchType === "recipes") {
      this.addRecipeToMeal();
    }
  }

  addedNutritionixFood() {
    const serving = JSON.parse(this.state.servingSize);
    //JSON stringify serving= {"measure":{"serving_weight":182,"measure":"medium (3\" dia)","seq":4,"qty":1}}
    const measure = serving.measure;
    //JSON stringify measure= {"serving_weight":182,"measure":"medium (3\" dia)","seq":4,"qty":1}
    const base =
      (measure.serving_weight / this.props.chosenFood.serving_weight_grams) *
      this.state.quantity;
    return {
      quantity: this.state.quantity,
      servingSize: measure.measure,
      name: this.props.chosenFoodName,
      servingWeight: Number(
        (measure.serving_weight * this.state.quantity).toFixed(2)
      ),
      calories: calcNutr("calories", base, this.props.chosenFood),
      carbs: calcNutr("carbs", base, this.props.chosenFood),
      protein: calcNutr("protein", base, this.props.chosenFood),
      totalFat: calcNutr("totalFat", base, this.props.chosenFood),
      saturatedFat: calcNutr("saturatedFat", base, this.props.chosenFood),
      cholesterol: calcNutr("cholesterol", base, this.props.chosenFood),
      sodium: calcNutr("sodium", base, this.props.chosenFood),
      fiber: calcNutr("fiber", base, this.props.chosenFood),
      sugars: calcNutr("sugars", base, this.props.chosenFood),
      potasium: calcNutr("potasium", base, this.props.chosenFood),
    };
  }

  addNutritionixFoodToMeal(foods) {
    const { mealType } = this.state;
    const day = {
      date: this.state.date,
      username: authenticationService.currentUserValue.username,
      meals: [
        {
          mealType: mealType,
          nutritionixFoods: [this.addedNutritionixFood()],
        },
      ],
    };
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(day),
    };
    fetch(`http://localhost:8080/api/days/addNutritionixFood`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (mealType === "BREAKFAST") {
          this.setState({
            breakfast: {
              chosenFoods: [...this.state.breakfast.chosenFoods, data],
              appOrCustomFoods: [...this.state.breakfast.appOrCustomFoods],
              recipes: [...this.state.breakfast.recipes],
            },
          });
        }
        if (mealType === "LUNCH") {
          this.setState({
            lunch: {
              chosenFoods: [...this.state.lunch.chosenFoods, data],
              appOrCustomFoods: [...this.state.lunch.appOrCustomFoods],
              recipes: [...this.state.lunch.recipes],
            },
          });
        }
        if (mealType === "DINNER") {
          this.setState({
            dinner: {
              chosenFoods: [...this.state.dinner.chosenFoods, data],
              appOrCustomFoods: [...this.state.dinner.appOrCustomFoods],
              recipes: [...this.state.dinner.recipes],
            },
          });
        }
        if (mealType === "SNACK") {
          this.setState({
            snack: {
              chosenFoods: [...this.state.snack.chosenFoods, data],
              appOrCustomFoods: [...this.state.snack.appOrCustomFoods],
              recipes: [...this.state.snack.recipes],
            },
          });
        }
      });
  }

  addedAppOrCustomFood() {
    const food = this.props.chosenAppOrCustomFood;
    const base = this.state.quantity / 100;
    return {
      quantity: this.state.quantity,
      servingSize: "grams",
      foodId: this.props.chosenAppOrCustomFood.id,
      name: this.props.chosenAppOrCustomFood.name,
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
    };
  }

  addFoodToMeal() {
    const { mealType } = this.state;
    const day = {
      date: this.state.date,
      username: authenticationService.currentUserValue.username,
      meals: [
        {
          mealType: mealType,
          foods: [this.addedAppOrCustomFood()],
        },
      ],
    };
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(day),
    };
    fetch(`http://localhost:8080/api/days/addFood`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (mealType === "BREAKFAST") {
          this.setState({
            breakfast: {
              chosenFoods: [...this.state.breakfast.chosenFoods],
              appOrCustomFoods: [
                ...this.state.breakfast.appOrCustomFoods,
                data,
              ],
              recipes: [...this.state.breakfast.recipes],
            },
          });
        }
        if (mealType === "LUNCH") {
          this.setState({
            lunch: {
              chosenFoods: [...this.state.lunch.chosenFoods],
              appOrCustomFoods: [...this.state.lunch.appOrCustomFoods, data],
              recipes: [...this.state.lunch.recipes],
            },
          });
        }
        if (mealType === "DINNER") {
          this.setState({
            dinner: {
              chosenFoods: [...this.state.dinner.chosenFoods],
              appOrCustomFoods: [...this.state.dinner.appOrCustomFoods, data],
              recipes: [...this.state.dinner.recipes],
            },
          });
        }
        if (mealType === "SNACK") {
          this.setState({
            snack: {
              chosenFoods: [...this.state.snack.chosenFoods],
              appOrCustomFoods: [...this.state.snack.appOrCustomFoods, data],
              recipes: [...this.state.snack.recipes],
            },
          });
        }
      });
  }

  addedRecipe() {
    const recipe = this.props.chosenRecipe;
    const quantity = this.state.quantity;
    return {
      quantity: quantity,
      servingSize: "serving",
      recipeId: recipe.id,
      name: recipe.name,
      servingWeight: Math.round(
        (recipe.servingWeight / recipe.numberOfServings) * quantity
      ),
      calories: Number(
        (recipe.calories / recipe.numberOfServings) * quantity
      ).toFixed(2),
      carbs: Number(
        (recipe.carbs / recipe.numberOfServings) * quantity
      ).toFixed(2),
      protein: Number(
        (recipe.protein / recipe.numberOfServings) * quantity
      ).toFixed(2),
      totalFat: Number(
        (recipe.totalFat / recipe.numberOfServings) * quantity
      ).toFixed(2),
      saturatedFat: Number(
        (recipe.saturatedFat / recipe.numberOfServings) * quantity
      ).toFixed(2),
      cholesterol: Number(
        (recipe.cholesterol / recipe.numberOfServings) * quantity
      ).toFixed(2),
      sodium: Number(
        (recipe.sodium / recipe.numberOfServings) * quantity
      ).toFixed(2),
      fiber: Number(
        (recipe.fiber / recipe.numberOfServings) * quantity
      ).toFixed(2),
      sugars: Number(
        (recipe.sugars / recipe.numberOfServings) * quantity
      ).toFixed(2),
      potasium: Number(
        (recipe.potasium / recipe.numberOfServings) * quantity
      ).toFixed(2),
    };
  }

  addRecipeToMeal() {
    const { mealType } = this.state;
    const day = {
      date: this.state.date,
      username: authenticationService.currentUserValue.username,
      meals: [
        {
          mealType: mealType,
          recipes: [this.addedRecipe()],
        },
      ],
    };
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(day),
    };
    fetch(`http://localhost:8080/api/days/addRecipe`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (mealType === "BREAKFAST") {
          this.setState({
            breakfast: {
              chosenFoods: [...this.state.breakfast.chosenFoods],
              appOrCustomFoods: [...this.state.breakfast.appOrCustomFoods],
              recipes: [...this.state.breakfast.recipes, data],
            },
          });
        }
        if (mealType === "LUNCH") {
          this.setState({
            lunch: {
              chosenFoods: [...this.state.lunch.chosenFoods],
              appOrCustomFoods: [...this.state.lunch.appOrCustomFoods],
              recipes: [...this.state.lunch.recipes, data],
            },
          });
        }
        if (mealType === "DINNER") {
          this.setState({
            dinner: {
              chosenFoods: [...this.state.dinner.chosenFoods],
              appOrCustomFoods: [...this.state.dinner.appOrCustomFoods],
              recipes: [...this.state.dinner.recipes, data],
            },
          });
        }
        if (mealType === "SNACK") {
          this.setState({
            snack: {
              chosenFoods: [...this.state.snack.chosenFoods],
              appOrCustomFoods: [...this.state.snack.appOrCustomFoods],
              recipes: [...this.state.snack.recipes, data],
            },
          });
        }
      });
  }

  calculateCaloriesBurned(chosenTime, kcalBurned, time) {
    const caloriesBurned = (chosenTime * kcalBurned) / time;
    return Math.round(caloriesBurned);
  }

  addAppOrCustomExercise(e) {
    if (e) {
      e.preventDefault();
    }
    const day = {
      date: this.state.date,
      username: authenticationService.currentUserValue.username,
      exercises: [
        {
          exerciseId: this.props.chosenAppOrCustomExercise.id,
          exerciseName: this.props.chosenAppOrCustomExercise.name,
          time: this.state.exerciseTime,
          caloriesBurned: this.calculateCaloriesBurned(
            this.state.exerciseTime,
            this.props.chosenAppOrCustomExercise.caloriesBurned,
            this.props.chosenAppOrCustomExercise.time
          ),
        },
      ],
    };
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(day),
    };
    fetch(`http://localhost:8080/api/days/addExercise`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          appOrCustomExercises: [...this.state.appOrCustomExercises, data],
        });
      });
  }

  addExercise(query, id, e) {
    if (e) {
      e.preventDefault();
    }
    if (query !== "") {
      const requestOptions = {
        method: "POST",
        headers: nutritionixHeader("POST"),
        body: JSON.stringify({ query: query }),
      };
      fetch(
        `https://trackapi.nutritionix.com/v2/natural/exercise`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          if (id !== null) {
            this.setState({
              exercises: [
                ...this.state.exercises,
                { id: id, ...data.exercises[0] },
              ],
            });
          } else {
            this.saveNutrtitionixExercise(query);
          }
        });
    }
  }

  saveNutrtitionixExercise(query) {
    const day = {
      date: this.state.date,
      username: authenticationService.currentUserValue.username,
      nutritionixExercises: [
        {
          exerciseQuery: query,
        },
      ],
    };
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(day),
    };
    fetch(
      `http://localhost:8080/api/days/addNutritionixExercise`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        this.addExercise(data.exerciseQuery, data.id);
      });
  }

  changeWaterIntake(e) {
    e.preventDefault();
    this.setState({ totalWaterIntake: e.target.value });
    if (validateNumber(e)) {
      const err = { ...this.state.errors };
      delete err[e.target.name];
      this.setState({
        errors: {
          ...err,
        },
      });
      const day = {
        date: this.state.date,
        username: authenticationService.currentUserValue.username,
        totalWaterIntake: e.target.value,
      };
      const requestOptions = {
        method: "PUT",
        headers: authHeader("PUT"),
        body: JSON.stringify(day),
      };
      fetch(`http://localhost:8080/api/days/changeWaterIntake`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ totalWaterIntake: data.totalWaterIntake });
        });
    } else {
      this.setState({
        errors: { ...this.state.errors, [e.target.name]: "Must be a number" },
      });
    }
  }

  removeNutritionixFood = (id) => {
    if (id) {
      const requestOptions = {
        method: "DELETE",
        headers: authHeader("DELETE"),
      };
      fetch(
        `http://localhost:8080/api/days/deleteNutritionixFood/${id}`,
        requestOptions
      ).then(
        this.setState({
          breakfast: {
            chosenFoods: [
              ...this.state.breakfast.chosenFoods.filter((f) => f.id !== id),
            ],
            appOrCustomFoods: [...this.state.breakfast.appOrCustomFoods],
            recipes: [...this.state.breakfast.recipes],
          },
          lunch: {
            chosenFoods: [
              ...this.state.lunch.chosenFoods.filter((f) => f.id !== id),
            ],
            appOrCustomFoods: [...this.state.lunch.appOrCustomFoods],
            recipes: [...this.state.lunch.recipes],
          },
          dinner: {
            chosenFoods: [
              ...this.state.dinner.chosenFoods.filter((f) => f.id !== id),
            ],
            appOrCustomFoods: [...this.state.dinner.appOrCustomFoods],
            recipes: [...this.state.dinner.recipes],
          },
          snack: {
            chosenFoods: [
              ...this.state.snack.chosenFoods.filter((f) => f.id !== id),
            ],
            appOrCustomFoods: [...this.state.snack.appOrCustomFoods],
            recipes: [...this.state.snack.recipes],
          },
        })
      );
    }
  };

  removeAppOrCustomFood = (id) => {
    if (id) {
      const requestOptions = {
        method: "DELETE",
        headers: authHeader("DELETE"),
      };
      fetch(
        `http://localhost:8080/api/days/deleteFood/${id}`,
        requestOptions
      ).then(
        this.setState({
          breakfast: {
            appOrCustomFoods: [
              ...this.state.breakfast.appOrCustomFoods.filter(
                (f) => f.id !== id
              ),
            ],
            chosenFoods: [...this.state.breakfast.chosenFoods],
            recipes: [...this.state.breakfast.recipes],
          },
          lunch: {
            appOrCustomFoods: [
              ...this.state.lunch.appOrCustomFoods.filter((f) => f.id !== id),
            ],
            chosenFoods: [...this.state.lunch.chosenFoods],
            recipes: [...this.state.lunch.recipes],
          },
          dinner: {
            appOrCustomFoods: [
              ...this.state.dinner.appOrCustomFoods.filter((f) => f.id !== id),
            ],
            chosenFoods: [...this.state.dinner.chosenFoods],
            recipes: [...this.state.dinner.recipes],
          },
          snack: {
            appOrCustomFoods: [
              ...this.state.snack.appOrCustomFoods.filter((f) => f.id !== id),
            ],
            chosenFoods: [...this.state.snack.chosenFoods],
            recipes: [...this.state.snack.recipes],
          },
        })
      );
    }
  };

  removeAppOrCustomExercise = (id) => {
    if (id) {
      const requestOptions = {
        method: "DELETE",
        headers: authHeader("DELETE"),
      };
      fetch(
        `http://localhost:8080/api/days/deleteExercise/${id}`,
        requestOptions
      ).then(
        this.setState({
          appOrCustomExercises: [
            ...this.state.appOrCustomExercises.filter((e) => e.id !== id),
          ],
        })
      );
    }
  };

  removeNutritionixExercise = (id) => {
    if (id) {
      const requestOptions = {
        method: "DELETE",
        headers: authHeader("DELETE"),
      };
      fetch(
        `http://localhost:8080/api/days/deleteNutritionixExercise/${id}`,
        requestOptions
      ).then(
        this.setState({
          exercises: [...this.state.exercises.filter((e) => e.id !== id)],
        })
      );
    }
  };

  style = {
    basicBtn: {
      fontWeight: "bold",
      backgroundColor: "gray",
      border: "none",
      color: "white",
      borderRadius: "6px",
    },
  };

  render() {
    const {
      date,
      totalWaterIntake,
      breakfast,
      lunch,
      dinner,
      snack,
      exercises,
      appOrCustomExercises,
    } = this.state;
    return (
      <React.Fragment>
        <input
          className="basicInput"
          type="date"
          name="date"
          defaultValue={date}
          onChange={(e) => this.changeDate(e)}
        />
        <br />
        <label>Total water intake (L): </label>
        <input
          className={
            this.state.errors.totalWaterIntake
              ? "errorSmallInput"
              : "smallInput"
          }
          type="text"
          name="totalWaterIntake"
          value={totalWaterIntake}
          onChange={(e) => this.changeWaterIntake(e)}
        />
        <form onSubmit={(e) => this.addFood(e)}>
          <input
            className="basicInput"
            type="text"
            name="chosenFoodName"
            value={this.props.chosenFoodName}
            placeholder="chosen food"
            required
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
            required
          />
          <select
            className={
              this.state.errors.servingSize ? "errorBasicInput" : "basicInput"
            }
            name="servingSize"
            onChange={(e) => this.changeSelect(e)}
            required
          >
            {this.props.chosenFood &&
              this.props.searchType === "nutritionix" &&
              this.props.chosenFood.alt_measures.map((measure) => {
                return (
                  <option
                    key={measure.measure}
                    value={JSON.stringify({ measure })}
                  >
                    {measure.measure}
                  </option>
                );
              })}
            {this.props.chosenAppOrCustomFood &&
              (this.props.searchType === "appFoods" ||
                this.props.searchType === "customFoods") && (
                <option value="g">g</option>
              )}
            {this.props.chosenRecipe && this.props.searchType === "recipes" && (
              <option value="serving">serving</option>
            )}
            {!this.props.chosenAppOrCustomFood &&
              !this.props.chosenFood &&
              !this.props.chosenRecipe && (
                <option value="">serving size</option>
              )}
          </select>
          <select
            className={
              this.state.errors.mealType ? "errorBasicInput" : "basicInput"
            }
            name="mealType"
            onChange={(e) => this.changeSelect(e)}
            required
          >
            <option value="">Choose meal</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACK">Snack</option>
          </select>
          <button
            style={this.style.basicBtn}
            disabled={this.isAddFoodDisabled()}
            type="submit"
          >
            Add food
          </button>
        </form>
        <div>
          <h4>Breakfast</h4>
          <Meal
            mealType={"breakfast"}
            foods={breakfast}
            removeNutritionixFood={this.removeNutritionixFood}
            removeAppOrCustomFood={this.removeAppOrCustomFood}
          ></Meal>
          <h4>Lunch</h4>
          <Meal
            mealType={"lunch"}
            foods={lunch}
            removeNutritionixFood={this.removeNutritionixFood}
            removeAppOrCustomFood={this.removeAppOrCustomFood}
          ></Meal>
          <h4>Dinner</h4>
          <Meal
            mealType={"dinner"}
            foods={dinner}
            removeNutritionixFood={this.removeNutritionixFood}
            removeAppOrCustomFood={this.removeAppOrCustomFood}
          ></Meal>
          <h4>Snacks</h4>
          <Meal
            mealType={"snack"}
            foods={snack}
            removeNutritionixFood={this.removeNutritionixFood}
            removeAppOrCustomFood={this.removeAppOrCustomFood}
          ></Meal>
          <Sum
            breakfast={breakfast}
            lunch={lunch}
            dinner={dinner}
            snack={snack}
            exercises={exercises}
            appOrCustomExercises={appOrCustomExercises}
          ></Sum>
          <h4>Exercises</h4>
          {this.props.searchType === "appExercises" ||
          this.props.searchType === "customExercises" ? (
            <form onSubmit={(e) => this.addAppOrCustomExercise(e)}>
              <input
                className="basicInput"
                type="text"
                name="chosenAppOrCustomExerciseName"
                value={this.props.chosenAppOrCustomExercise.name}
                placeholder="chosen exercise"
                readOnly
                required
              />
              <input
                className={
                  this.state.errors.exerciseTime
                    ? "errorBasicInput"
                    : "basicInput"
                }
                type="text"
                name="exerciseTime"
                placeholder="time(in minutes)"
                onChange={(e) => this.changeNumber(e)}
                required
              />
              <button
                style={this.style.basicBtn}
                disabled={this.isAddExerciseDisabled()}
                type="submit"
              >
                Add exercise
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => this.addExercise(this.state.exercise, null, e)}
            >
              <input
                className="nutritionixExerciseInput"
                type="text"
                name="exercise"
                defaultValue=""
                placeholder="type exercise (eg. 15 min run, 30 min walk etc) "
                onChange={(e) => this.change(e)}
              />
              <button
                style={this.style.basicBtn}
                disabled={this.isAddNutritionixExerciseDisabled()}
                type="submit"
              >
                Add exercise
              </button>
            </form>
          )}
          <Exercises
            exercises={exercises}
            appOrCustomExercises={appOrCustomExercises}
            removeNutritionixExercise={this.removeNutritionixExercise}
            removeAppOrCustomExercise={this.removeAppOrCustomExercise}
          ></Exercises>
        </div>
      </React.Fragment>
    );
  }
}

DashboardWorkspace.propTypes = {
  chosenFoodName: PropTypes.string,
  chosenFood: PropTypes.object,
  chosenAppOrCustomFood: PropTypes.object,
  chosenRecipe: PropTypes.object,
  chosenAppOrCustomExercise: PropTypes.object,
  searchType: PropTypes.string,
};

export default DashboardWorkspace;
