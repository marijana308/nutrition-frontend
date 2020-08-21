import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { Role } from "../../helpers/role";
import { authHeader } from "../../helpers/auth-header";
import {
  validateNumber,
  validateNotEmpty,
  areErrorsEmpty,
} from "../../helpers/validations";

export class FoodWorkspace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newFood: this.emptyFood(),
      isPremium: authenticationService.currentUserValue.role === Role.Premium,
      isAdmin: authenticationService.currentUserValue.role === Role.Admin,
      errors: {},
    };
  }

  emptyFood() {
    return {
      username: authenticationService.currentUserValue.username,
      name: "",
      calories: "",
      totalFat: "",
      saturatedFat: "",
      cholesterol: "",
      sodium: "",
      totalCarbs: "",
      fiber: "",
      sugars: "",
      protein: "",
      potasium: "",
    };
  }

  changeNewFood(e) {
    this.setState({
      newFood: {
        ...this.state.newFood,
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
  }

  changeNewFoodName(e) {
    this.setState({
      newFood: {
        ...this.state.newFood,
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
  }

  saveNewFood(e) {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: authHeader("POST"),
      body: JSON.stringify(this.state.newFood),
    };
    return fetch(`http://localhost:8080/api/foods/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        alert("Food has been saved!");
        this.setState({
          newFood: this.emptyFood(),
        });
      });
  }

  updateFood(e) {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(this.props.chosenFood),
    };
    return fetch(`http://localhost:8080/api/foods/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        alert("Food has been updated!");
      });
  }

  deleteFood(id) {
    if (window.confirm("Are you sure?")) {
      const requestOptions = {
        method: "DELETE",
        headers: authHeader("DELETE"),
      };
      return fetch(
        `http://localhost:8080/api/foods/${id}`,
        requestOptions
      ).then((response) => {
        alert("Food has been deleted!");
        this.props.toggleCreateMode();
      });
    }
  }

  style = {
    container: {
      width: "300px",
      marginLeft: "20px",
      marginTop: "10px",
    },
    label: {
      width: "6em",
      color: "dark gray",
    },
    btn: {
      marginTop: "5px",
      width: "90%",
      padding: "10px",
      fontWeight: "bold",
      fontSize: "110%",
      backgroundColor: "gray",
      border: "none",
      color: "white",
      borderRadius: "6px",
    },
    h4: {
      marginLeft: "20px",
      marginBottom: "50px",
    },
  };

  render() {
    return (
      <div className="workspace">
        {this.props.createMode && (
          <div style={this.style.container}>
            <h4 style={this.style.h4}>Create new food</h4>
            <form onSubmit={(e) => this.saveNewFood(e)}>
              <label style={this.style.label} htmlFor="name">
                Name*
              </label>
              <input
                className={
                  this.state.errors.name ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="name"
                value={this.state.newFood.name}
                onChange={(e) => this.changeNewFoodName(e)}
                required
              />
              <br />
              <label style={this.style.label} htmlFor="calories">
                Calories*
              </label>
              <input
                className={
                  this.state.errors.calories ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="calories"
                value={this.state.newFood.calories}
                onChange={(e) => this.changeNewFood(e)}
                required
              />
              <br />
              <label style={this.style.label} htmlFor="totalCarbs">
                Total carbs
              </label>
              <input
                className={
                  this.state.errors.totalCarbs
                    ? "errorBasicInput"
                    : "basicInput"
                }
                type="text"
                name="totalCarbs"
                value={this.state.newFood.totalCarbs}
                onChange={(e) => this.changeNewFood(e)}
              />
              <br />
              <label style={this.style.label} htmlFor="protein">
                Protein
              </label>
              <input
                className={
                  this.state.errors.protein ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="protein"
                value={this.state.newFood.protein}
                onChange={(e) => this.changeNewFood(e)}
              />
              <br />
              <label style={this.style.label} htmlFor="totalFat">
                Total fat
              </label>
              <input
                className={
                  this.state.errors.totalFat ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="totalFat"
                value={this.state.newFood.totalFat}
                onChange={(e) => this.changeNewFood(e)}
              />
              <br />
              {(this.state.isPremium || this.state.isAdmin) && (
                <React.Fragment>
                  <label style={this.style.label} htmlFor="saturatedFat">
                    Saturated fat
                  </label>
                  <input
                    className={
                      this.state.errors.saturatedFat
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="saturatedFat"
                    value={this.state.newFood.saturatedFat}
                    onChange={(e) => this.changeNewFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="cholesterol">
                    Cholesterol
                  </label>
                  <input
                    className={
                      this.state.errors.cholesterol
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="cholesterol"
                    value={this.state.newFood.cholesterol}
                    onChange={(e) => this.changeNewFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="sodium">
                    Sodium
                  </label>
                  <input
                    className={
                      this.state.errors.sodium
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="sodium"
                    value={this.state.newFood.sodium}
                    onChange={(e) => this.changeNewFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="fiber">
                    Fiber
                  </label>
                  <input
                    className={
                      this.state.errors.fiber ? "errorBasicInput" : "basicInput"
                    }
                    type="text"
                    name="fiber"
                    value={this.state.newFood.fiber}
                    onChange={(e) => this.changeNewFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="sugars">
                    Sugars
                  </label>
                  <input
                    className={
                      this.state.errors.sugars
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="sugars"
                    value={this.state.newFood.sugars}
                    onChange={(e) => this.changeNewFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="potasium">
                    Potasium
                  </label>
                  <input
                    className={
                      this.state.errors.potasium
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="potasium"
                    value={this.state.newFood.potasium}
                    onChange={(e) => this.changeNewFood(e)}
                  />
                  <br />
                </React.Fragment>
              )}
              <button
                style={this.style.btn}
                disabled={areErrorsEmpty(this.state.errors)}
                type="submit"
              >
                Save food
              </button>
            </form>
          </div>
        )}
        {!this.props.createMode && (
          <div style={this.style.container}>
            <h4 style={this.style.h4}>Edit chosen food</h4>
            <form onSubmit={(e) => this.updateFood(e)}>
              <label style={this.style.label} htmlFor="name">
                Name
              </label>
              <input
                className={
                  this.props.errors.name ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="name"
                value={this.props.chosenFood.name}
                onChange={(e) => this.props.changeChosenFoodName(e)}
                required
              />
              <br />
              <label style={this.style.label} htmlFor="calories">
                Calories
              </label>
              <input
                className={
                  this.props.errors.calories ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="calories"
                value={this.props.chosenFood.calories}
                onChange={(e) => this.props.changeChosenFood(e)}
                required
              />
              <br />
              <label style={this.style.label} htmlFor="totalCarbs">
                Total carbs
              </label>
              <input
                className={
                  this.props.errors.totalCarbs
                    ? "errorBasicInput"
                    : "basicInput"
                }
                type="text"
                name="totalCarbs"
                value={this.props.chosenFood.totalCarbs}
                onChange={(e) => this.props.changeChosenFood(e)}
              />
              <br />

              <label style={this.style.label} htmlFor="protein">
                Protein
              </label>
              <input
                className={
                  this.props.errors.protein ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="protein"
                value={this.props.chosenFood.protein}
                onChange={(e) => this.props.changeChosenFood(e)}
              />
              <br />
              <label style={this.style.label} htmlFor="totalFat">
                Total fat
              </label>
              <input
                className={
                  this.props.errors.totalFat ? "errorBasicInput" : "basicInput"
                }
                type="text"
                name="totalFat"
                value={this.props.chosenFood.totalFat}
                onChange={(e) => this.props.changeChosenFood(e)}
              />
              <br />
              {(this.state.isPremium || this.state.isAdmin) && (
                <React.Fragment>
                  <label style={this.style.label} htmlFor="saturatedFat">
                    Saturated fat
                  </label>
                  <input
                    className={
                      this.props.errors.saturatedFat
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="saturatedFat"
                    value={this.props.chosenFood.saturatedFat}
                    onChange={(e) => this.props.changeChosenFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="cholesterol">
                    Cholesterol
                  </label>
                  <input
                    className={
                      this.props.errors.cholesterol
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="cholesterol"
                    value={this.props.chosenFood.cholesterol}
                    onChange={(e) => this.props.changeChosenFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="sodium">
                    Sodium
                  </label>
                  <input
                    className={
                      this.props.errors.sodium
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="sodium"
                    value={this.props.chosenFood.sodium}
                    onChange={(e) => this.props.changeChosenFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="fiber">
                    Fiber
                  </label>
                  <input
                    className={
                      this.props.errors.fiber ? "errorBasicInput" : "basicInput"
                    }
                    type="text"
                    name="fiber"
                    value={this.props.chosenFood.fiber}
                    onChange={(e) => this.props.changeChosenFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="sugars">
                    Sugars
                  </label>
                  <input
                    className={
                      this.props.errors.sugars
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="sugars"
                    value={this.props.chosenFood.sugars}
                    onChange={(e) => this.props.changeChosenFood(e)}
                  />
                  <br />
                  <label style={this.style.label} htmlFor="potasium">
                    Potasium
                  </label>
                  <input
                    className={
                      this.props.errors.potasium
                        ? "errorBasicInput"
                        : "basicInput"
                    }
                    type="text"
                    name="potasium"
                    value={this.props.chosenFood.potasium}
                    onChange={(e) => this.props.changeChosenFood(e)}
                  />
                  <br />
                </React.Fragment>
              )}
              <button
                style={this.style.btn}
                disabled={areErrorsEmpty(this.props.errors)}
                type="submit"
              >
                Update food
              </button>
            </form>
            <button
              style={this.style.btn}
              onClick={(e) => this.deleteFood(this.props.chosenFood.id)}
            >
              Delete food
            </button>
            <button
              style={this.style.btn}
              onClick={(e) => this.props.toggleCreateMode(e)}
            >
              Create new food
            </button>
          </div>
        )}
      </div>
    );
  }
}

FoodWorkspace.propTypes = {
  chosenFood: PropTypes.object,
  createMode: PropTypes.bool,
  toggleCreateMode: PropTypes.func,
  changeChosenFood: PropTypes.func,
  changeChosenFoodName: PropTypes.func,
  errors: PropTypes.object,
};

export default FoodWorkspace;
