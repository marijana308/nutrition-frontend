import React, { Component } from "react";
import { authenticationService } from "../../services/authentication.service";
import { authHeader } from "../../helpers/auth-header";
import {
  validateNumber,
  validateNotEmpty,
  areErrorsEmpty,
} from "../../helpers/validations";

export class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: authenticationService.currentUserValue,
      errors: {},
    };
  }

  change(e) {
    this.setState({
      userDetails: {
        ...this.state.userDetails,
        [e.target.name]: e.target.value,
      },
    });
  }

  changeNumber(e) {
    this.setState({
      userDetails: {
        ...this.state.userDetails,
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

  changeNotEmpty(e) {
    this.setState({
      userDetails: {
        ...this.state.userDetails,
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

  updateUser(e) {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: authHeader("PUT"),
      body: JSON.stringify(this.state.userDetails),
    };
    return fetch(`http://localhost:8080/api/updateUser/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let updatedUser = { ...data, token: this.state.userDetails.token };
        authenticationService.currentUserSub.next(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        alert("Your profile has been updated!");
      });
  }

  getCurrentDate() {
    return new Date().toJSON().slice(0, 10);
  }

  style = {
    label: {
      width: "10em",
      padding: "5px",
      textAlign: "center",
    },
  };

  render() {
    const { userDetails } = this.state;
    const userBirthday = userDetails.birthday.split("T")[0];
    const userGoalDate = userDetails.goalDate.split("T")[0];
    return (
      <div className="myContainer">
        <div className="transparentContainer">
          <form onSubmit={(e) => this.updateUser(e)}>
            <label htmlFor="username" style={this.style.label}>
              Username
            </label>
            <input
              className={
                this.state.errors.username ? "errorBasicInput" : "basicInput"
              }
              type="text"
              name="username"
              value={userDetails.username}
              onChange={(e) => this.changeNotEmpty(e)}
              required
            />
            <br />
            <label htmlFor="password" style={this.style.label}>
              Password
            </label>
            <input
              className={
                this.state.errors.password ? "errorBasicInput" : "basicInput"
              }
              type="password"
              name="password"
              value={userDetails.password}
              onChange={(e) => this.changeNotEmpty(e)}
              required
            />
            <br />
            <label htmlFor="firstname" style={this.style.label}>
              Firstname
            </label>
            <input
              className="basicInput"
              type="text"
              name="firstname"
              value={userDetails.firstname}
              onChange={(e) => this.change(e)}
            />
            <br />
            <label htmlFor="lastname" style={this.style.label}>
              Lastname
            </label>
            <input
              className="basicInput"
              type="text"
              name="lastname"
              value={userDetails.lastname}
              onChange={(e) => this.change(e)}
            />
            <br />
            <label htmlFor="height" style={this.style.label}>
              Height
            </label>
            <input
              className={
                this.state.errors.height ? "errorBasicInput" : "basicInput"
              }
              type="text"
              name="height"
              value={userDetails.height}
              onChange={(e) => this.changeNumber(e)}
              required
            />
            <br />
            <label htmlFor="weight" style={this.style.label}>
              Weight
            </label>
            <input
              className={
                this.state.errors.weight ? "errorBasicInput" : "basicInput"
              }
              type="text"
              name="weight"
              value={userDetails.weight}
              onChange={(e) => this.changeNumber(e)}
              required
            />
            <br />
            <label htmlFro="gender" style={this.style.label}>
              Gender
            </label>
            <select
              className="basicInput"
              name="gender"
              value={userDetails.gender}
              onChange={(e) => this.change(e)}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <br />
            <label htmlFor="date" style={this.style.label}>
              Birthday
            </label>
            <input
              className="basicInput"
              type="date"
              name="birthday"
              value={userBirthday}
              onChange={(e) => this.change(e)}
              max={this.getCurrentDate()}
              required
            />
            <br />
            <label htmlFor="activityLevel" style={this.style.label}>
              Activity level
            </label>
            <select
              className="basicInput"
              name="activityLevel"
              value={userDetails.activityLevel}
              onChange={(e) => this.change(e)}
            >
              <option value="SEDENTARY">Sedentary</option>
              <option value="LOW">Low</option>
              <option value="ACTIVE">Active</option>
              <option value="VERYACTIVE">Very active</option>
            </select>
            <br />
            <label htmlFor="goalWeight" style={this.style.label}>
              Goal weight
            </label>
            <input
              className={
                this.state.errors.goalWeight ? "errorBasicInput" : "basicInput"
              }
              type="text"
              name="goalWeight"
              value={userDetails.goalWeight}
              onChange={(e) => this.changeNumber(e)}
              required
            />
            <br />
            <label htmlFor="goalDate" style={this.style.label}>
              Goal date
            </label>
            <input
              className="basicInput"
              type="date"
              name="goalDate"
              value={userGoalDate}
              onChange={(e) => this.change(e)}
              required
            />
            <br />
            <button
              className="mediumWhiteBtn"
              disabled={areErrorsEmpty(this.state.errors)}
              type="submit"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default UserProfile;
