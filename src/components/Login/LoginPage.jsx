import React from "react";
import { Link } from "react-router-dom";

import { authenticationService } from "../../services/authentication.service";
import { Role } from "../../helpers/role";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      error: null,
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

  login(e) {
    e.preventDefault();
    const { username, password } = this.state;
    authenticationService.login(username, password).then(
      (user) => {
        if (user.role === Role.Admin) {
          const { from } = this.props.location.state || {
            from: { pathname: "/foods" },
          };
          this.props.history.push(from);
        } else {
          const { from } = this.props.location.state || {
            from: { pathname: "/dashboard" },
          };
          this.props.history.push(from);
        }
      },
      (error) => {
        this.setState({ error: "Invalid username or password." });
      }
    );
  }

  style = {
    form: {
      width: "100%",
    },
    singUpMessage: {
      textAlign: "center",
      display: "block",
      color: "white",
    },
  };

  render() {
    return (
      <div className="welcomeContainer">
        <div className="transparentContainer">
          <form onSubmit={(e) => this.login(e)} style={this.style.form}>
            <input
              className="loginInput"
              type="text"
              name="username"
              value={this.state.username}
              onChange={(e) => this.change(e)}
              required
              placeholder="username"
            />
            <br />
            <input
              className="loginInput"
              type="password"
              name="password"
              value={this.state.password}
              onChange={(e) => this.change(e)}
              required
              placeholder="password"
            />
            <br />
            <button type="submit" className="whiteBtn">
              Login
            </button>
          </form>
          <Link to="/signup" style={this.style.singUpMessage}>
            Don't have an account? Sign up!
          </Link>
          {this.state.error && (
            <div className={"alert alert-danger"}>{this.state.error}</div>
          )}
        </div>
      </div>
    );
  }
}

export { LoginPage };
