import React, { Component } from "react";
import PropTypes from "prop-types";
import { authenticationService } from "../../services/authentication.service";
import { Role } from "../../helpers/role";
import { authHeader } from "../../helpers/auth-header";

export class FoodSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foods: [],
      isAdmin: authenticationService.currentUserValue.role === Role.Admin,
    };
  }

  searchCustomFoods(e) {
    const query = e.target.value;
    if (query !== "") {
      const requestOptions = { method: "GET", headers: authHeader("GET") };
      return fetch(
        `http://localhost:8080/api/foods/${authenticationService.currentUserValue.username}?query=${query}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            foods: data,
          });
        });
    }
  }

  searchAdminFoods(e) {
    const query = e.target.value;
    if (query !== "") {
      const requestOptions = { method: "GET", headers: authHeader("GET") };
      return fetch(
        `http://localhost:8080/api/foods/admin?query=${query}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            foods: data,
          });
        });
    }
  }

  render() {
    return (
      <div className="searchResults">
        {this.state.isAdmin && (
          <input
            className="searchInput"
            type="text"
            placeholder="search foods to edit..."
            onChange={(e) => this.searchAdminFoods(e)}
          />
        )}
        {!this.state.isAdmin && (
          <input
            className="searchInput"
            type="text"
            placeholder="search foods to edit..."
            onChange={(e) => this.searchCustomFoods(e)}
          />
        )}
        <br />
        {this.state.foods.map((food) => (
          <React.Fragment>
            <button
              className="searchResultBtn"
              key={food.id}
              onClick={(e) => {
                this.props.foodClicked(food);
                this.setState({ foods: [] });
              }}
            >
              {food.name}
            </button>
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  }
}

FoodSearch.propTypes = {
  foodClicked: PropTypes.func,
};

export default FoodSearch;
