import React, { Component } from "react";
import { authenticationService } from "../services/authentication.service";
import { authHeader } from "../helpers/auth-header";
import {
  validateNumber,
  validateNotEmpty,
  areErrorsEmpty,
} from "../helpers/validations";

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
    container: {
      width: "100%",
      margin: "10px",
    },
    label: {
      width: "7em",
      padding: "5px",
      textAlign: "center",
    },
    input: {
      width: "10em",
      padding: "5px",
    },
    updateBtn: {
      width: "11em",
      padding: "10px",
      fontWeight: "bold",
      fontSize: "150%",
      backgroundColor: "gray",
      border: "none",
      color: "white",
      borderRadius: "6px",
      marginLeft: "10px",
      marginTop: "10px",
    },
  };

  render() {
    const { userDetails } = this.state;
    const userBirthday = userDetails.birthday.split("T")[0];
    const userGoalDate = userDetails.goalDate.split("T")[0];
    return (
      <div style={this.style.container}>
        <form onSubmit={(e) => this.updateUser(e)}>
          <label htmlFor="username" style={this.style.label}>
            Username
          </label>
          <input
            style={this.style.input}
            className={this.state.errors.username ? "error" : ""}
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
            style={this.style.input}
            className={this.state.errors.password ? "error" : ""}
            type="text"
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
            style={this.style.input}
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
            style={this.style.input}
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
            style={this.style.input}
            className={this.state.errors.height ? "error" : ""}
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
            style={this.style.input}
            className={this.state.errors.weight ? "error" : ""}
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
            style={this.style.input}
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
            style={this.style.input}
            type="date"
            name="birthday"
            value={userBirthday}
            onChange={(e) => this.change(e)}
            max={this.getCurrentDate()}
            required
          />
          <br />
          <label htmlFro="activityLevel" style={this.style.label}>
            Activity level
          </label>
          <select
            style={this.style.input}
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
            style={this.style.input}
            className={this.state.errors.goalWeight ? "error" : ""}
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
            style={this.style.input}
            type="date"
            name="goalDate"
            value={userGoalDate}
            onChange={(e) => this.change(e)}
            required
          />
          <br />
          <button
            style={this.style.updateBtn}
            disabled={areErrorsEmpty(this.state.errors)}
            type="submit"
          >
            Update
          </button>
        </form>
      </div>
    );
  }
}

export default UserProfile;
