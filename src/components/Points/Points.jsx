import React, { Component } from "react";
import { authenticationService } from "../../services/authentication.service";
import { authHeader } from "../../helpers/auth-header";
import { history } from "../../helpers/history";

export class Points extends Component {
  upgradeToPremium(e) {
    e.preventDefault();
    if (authenticationService.currentUserValue.points >= 100) {
      const requestOptions = { method: "GET", headers: authHeader("GET") };
      return fetch(
        `http://localhost:8080/api/updateToPremium/${authenticationService.currentUserValue.username}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          alert(
            "Your profile has been updated! Log in again to access premium privileges"
          );
          authenticationService.logout();
          history.push("/login");
        });
    } else {
      alert("You need at least a 100 points to upgrade!");
    }
  }

  style = {
    container: {
      width: "100%",
      margin: "50px",
      textAlign: "center",
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
    p: {
      textAlign: "center",
      color: "gray",
    },
    bold: {
      textAlign: "center",
      fontSize: "170%",
      fontWeight: "bold",
      color: "gray",
    },
  };
  render() {
    return (
      <div className="myContainer">
        <div className="transparentContainer">
          <p style={this.style.p}>
            For every 7 consecutive days you get 10 points and when you collect
            100 points you can upgrade to premium!
          </p>
          <br />
          <p style={this.style.bold}>
            Streak: {authenticationService.currentUserValue.streak}
            {" | "} Points: {authenticationService.currentUserValue.points}
          </p>
          <br />
          {/* <p style={this.style.p}>
            Points: {authenticationService.currentUserValue.points}
          </p> */}
          <br />
          <button
            className="whiteBtn"
            onClick={(e) => this.upgradeToPremium(e)}
          >
            Upgrade
          </button>
        </div>
      </div>
    );
  }
}

export default Points;
