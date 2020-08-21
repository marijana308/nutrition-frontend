import React, { Component } from "react";
import FoodSearch from "./FoodSearch";
import FoodWorkspace from "./FoodWorkspace";
import { validateNumber, validateNotEmpty } from "../../helpers/validations";

export class FoodPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createMode: true,
      chosenFood: {},
      errors: {},
    };
  }

  foodClicked = (food) => {
    this.setState({
      chosenFood: food,
      createMode: false,
    });
  };

  changeChosenFood = (e) => {
    this.setState({
      chosenFood: {
        ...this.state.chosenFood,
        [e.target.name]: e.target.value,
      },
    });
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
  };

  changeChosenFoodName = (e) => {
    this.setState({
      chosenFood: {
        ...this.state.chosenFood,
        [e.target.name]: e.target.value,
      },
    });
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
  };

  toggleCreateMode = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      createMode: true,
    });
  };

  render() {
    return (
      <div className="myContainer">
        <FoodSearch foodClicked={this.foodClicked}></FoodSearch>
        <FoodWorkspace
          chosenFood={this.state.chosenFood}
          createMode={this.state.createMode}
          toggleCreateMode={this.toggleCreateMode}
          changeChosenFood={this.changeChosenFood}
          changeChosenFoodName={this.changeChosenFoodName}
          errors={this.state.errors}
        ></FoodWorkspace>
      </div>
    );
  }
}

export default FoodPage;
