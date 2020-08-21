import React, { Component } from "react";
import { registrationService } from "../services/registration.service";
import { authenticationService } from "../services/authentication.service";
import { Role } from "../helpers/role";

export class SignupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      height: "",
      weight: "",
      gender: "",
      birthday: "",
      activityLevel: "",
      goalWeight: "",
      goalDate: "",
      error: null,
      errors: {},
    };

    // redirect to home if already logged in
    if (authenticationService.currentUserValue) {
      if (authenticationService.currentUserValue.role === Role.Admin) {
        this.props.history.push("/foods");
      }
      if (
        authenticationService.currentUserValue.role === Role.User ||
        authenticationService.currentUserValue.role === Role.Premium
      ) {
        this.props.history.push("/dashboard");
      }
    }
  }

  change(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  signup(e) {
    e.preventDefault();
    const {
      username,
      password,
      firstname,
      lastname,
      height,
      weight,
      gender,
      birthday,
      activityLevel,
      goalWeight,
      goalDate,
    } = this.state;
    registrationService
      .register(
        username,
        password,
        firstname,
        lastname,
        height,
        weight,
        gender,
        birthday,
        activityLevel,
        goalWeight,
        goalDate
      )
      .then(
        (user) => {
          window.location.reload(true);
        },
        (error) => {
          this.setState({ error: "Ups... something went wrong." });
        }
      );
  }

  validateText(e) {
    if (e.target.value === "") {
      this.setState({
        errors: {
          ...this.state.errors,
          [e.target.name]: "Field can't be empty",
        },
      });
    } else {
      this.setState({ errors: { ...this.state.errors, [e.target.name]: "" } });
    }
  }

  validateRepeatedPassword(e) {
    if (this.state.password !== this.state.repeatedPassword) {
      this.setState({
        errors: {
          ...this.state.errors,
          repeatedPassword: "Passwords don't match",
        },
      });
    } else {
      this.setState({ errors: { ...this.state.errors, repeatedPassword: "" } });
    }
  }

  validateNumber(e) {
    if (!e.target.value.match(/^[0-9]+$/)) {
      this.setState({
        errors: {
          ...this.state.errors,
          [e.target.name]: "Must be a number",
        },
      });
    } else {
      this.setState({ errors: { ...this.state.errors, [e.target.name]: "" } });
    }
  }

  validateSelect(e) {
    if (e.target.value === "") {
      this.setState({
        errors: {
          ...this.state.errors,
          [e.target.name]: "Must select something",
        },
      });
    } else {
      this.setState({ errors: { ...this.state.errors, [e.target.name]: "" } });
    }
  }

  validateDate(e) {
    if (e.target.value === "") {
      this.setState({
        errors: { ...this.state.errors, [e.target.name]: "Must select a date" },
      });
    } else {
      this.setState({ errors: { ...this.state.errors, [e.target.name]: "" } });
    }
  }

  isDisabled() {
    const { errors } = this.state;
    if (
      errors.username === "" &&
      errors.password === "" &&
      errors.repeatedPassword === "" &&
      errors.height === "" &&
      errors.weight === "" &&
      errors.gender === "" &&
      errors.birthday === "" &&
      errors.activityLevel === "" &&
      errors.goalWeight === "" &&
      errors.goalDate === ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  style = {
    header: {
      color: "gray",
      textAlign: "center",
    },
    container: {
      margin: "auto",
      width: "25em",
    },
    input: {
      width: "100%",
      marginBottom: "20px",
      padding: "5px",
      border: "1px solid gray",
      borderRadius: "6px",
    },
    errorMessage: {
      float: "right",
    },
    singUpBtn: {
      width: "100%",
      padding: "10px",
      fontWeight: "bold",
      fontSize: "150%",
      backgroundColor: "gray",
      border: "none",
      color: "white",
      borderRadius: "6px",
      marginBottom: "150px",
    },
  };

  render() {
    return (
      <div style={this.style.container}>
        <h2 style={this.style.header}>Sign up</h2>
        <form onSubmit={(e) => this.signup(e)}>
          <label style={this.style.label} htmlFor="username">
            Username
          </label>
          <p style={this.style.errorMessage}>{this.state.errors.username}</p>
          <br />
          <input
            style={this.style.input}
            className={this.state.errors.username ? "error" : ""}
            type="text"
            name="username"
            value={this.state.username}
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateText(e)}
            required
          />
          <br />
          <label htmlFor="password">Password </label>
          <p style={this.style.errorMessage}>{this.state.errors.password}</p>
          <br />
          <input
            style={this.style.input}
            className={this.state.errors.password ? "error" : ""}
            type="password"
            name="password"
            value={this.state.password}
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateText(e)}
            required
          />
          <br />
          <label htmlFor="repeatedPassword">Repeat password </label>
          <p style={this.style.errorMessage}>
            {this.state.errors.repeatedPassword}
          </p>
          <br />
          <input
            style={this.style.input}
            className={this.state.errors.repeatedPassword ? "error" : ""}
            type="password"
            name="repeatedPassword"
            value={this.state.repeatedPassword}
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateRepeatedPassword(e)}
            required
          />
          <br />
          <label htmlFor="firstname">Firstname </label>
          <br />
          <input
            style={this.style.input}
            type="text"
            name="firstname"
            value={this.state.firstname}
            onChange={(e) => this.change(e)}
          />
          <br />
          <label htmlFor="lastname">Lastname </label>
          <br />
          <input
            style={this.style.input}
            type="text"
            name="lastname"
            value={this.state.lastname}
            onChange={(e) => this.change(e)}
          />
          <br />
          <label htmlFor="height">Height(cm)</label>
          <p style={this.style.errorMessage}>{this.state.errors.height}</p>
          <br />
          <input
            style={this.style.input}
            className={this.state.errors.height ? "error" : ""}
            type="text"
            name="height"
            value={this.state.height}
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateNumber(e)}
            required
          />
          <br />
          <label htmlFor="weight">Weight(kg)</label>
          <p style={this.style.errorMessage}>{this.state.errors.weight}</p>
          <br />
          <input
            style={this.style.input}
            className={this.state.errors.weight ? "error" : ""}
            type="text"
            name="weight"
            value={this.state.weight}
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateNumber(e)}
            required
          />
          <br />
          <label htmlFor="gender">Gender </label>
          <p style={this.style.errorMessage}>{this.state.errors.gender}</p>
          <br />
          <select
            style={this.style.input}
            className={this.state.errors.gender ? "error" : ""}
            name="gender"
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateSelect(e)}
          >
            <option value="">Select your gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <br />
          <label htmlFor="birthday">Birthday </label>
          <p style={this.style.errorMessage}>{this.state.errors.birthday}</p>
          <br />
          <input
            style={this.style.input}
            className={this.state.errors.birthday ? "error" : ""}
            type="date"
            name="birthday"
            value={this.state.birthday}
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateDate(e)}
            required
          />
          <br />
          <label htmlFor="activityLevel">Activity Level </label>
          <p style={this.style.errorMessage}>
            {this.state.errors.activityLevel}
          </p>
          <br />
          <select
            style={this.style.input}
            className={this.state.errors.activityLevel ? "error" : ""}
            name="activityLevel"
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateSelect(e)}
          >
            <option value="">Select your activity level</option>
            <option value="SEDENTARY">Sedentary</option>
            <option value="LOW">Low</option>
            <option value="ACTIVE">Active</option>
            <option value="VERYACTIVE">Very active</option>
          </select>
          <br />
          <label htmlFor="goalWeight">Goal weight (kg)</label>
          <p style={this.style.errorMessage}>{this.state.errors.goalWeight}</p>
          <br />
          <input
            style={this.style.input}
            className={this.state.errors.goalWeight ? "error" : ""}
            type="text"
            name="goalWeight"
            value={this.state.goalWeight}
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateNumber(e)}
            required
          />
          <br />
          <label htmlFor="goalDate">Goal date </label>
          <p style={this.style.errorMessage}>{this.state.errors.goalDate}</p>
          <br />
          <input
            style={this.style.input}
            className={this.state.errors.goalDate ? "error" : ""}
            type="date"
            name="goalDate"
            value={this.state.goalDate}
            onChange={(e) => this.change(e)}
            onBlur={(e) => this.validateDate(e)}
            required
          />
          <br />
          <button
            className="signUpBtn"
            style={this.style.singUpBtn}
            disabled={this.isDisabled()}
            type="submit"
          >
            Sign up
          </button>
        </form>
        {this.state.error && (
          <div className={"alert alert-danger"}>{this.state.error}</div>
        )}
      </div>
    );
  }
}

export default SignupPage;
