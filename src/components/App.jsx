import React from "react";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";

//import { history } from "../helpers/history";
import { Role } from "../helpers/role";
import { authenticationService } from "../services/authentication.service";
import { PrivateRoute } from "./PrivateRoute";
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";
import { DashboardPage } from "./Dashboard/DashboardPage";
import { UserProfile } from "./UserProfile";
import { RecipePage } from "./Recipes/RecipePage";
import { FoodPage } from "./Foods/FoodPage";
import { ExercisePage } from "./Exercises/ExercisePage";
import { TargetsPage } from "./Targets/TargetsPage";

const history = createBrowserHistory();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isAdmin: false,
      isPremium: false,
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe((x) => {
      this.setState({
        currentUser: x,
        isAdmin: x && x.role === Role.Admin,
        isPremium: x && x.role === Role.Premium,
      });
    });
  }

  logout() {
    authenticationService.logout();
    history.push("/login");
  }

  // navbarStyle = {
  //   color: "white",
  //   backgroundColor: "gray",
  // };

  render() {
    const { currentUser, isAdmin, isPremium } = this.state;
    return (
      <Router history={history}>
        {currentUser && (
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
              {!isAdmin && (
                <React.Fragment>
                  <Link to="/userprofile" className="nav-item nav-link">
                    Profile
                  </Link>
                  <Link to="/dashboard" className="nav-item nav-link">
                    Dashboard
                  </Link>
                  {isPremium && (
                    <Link to="/targets" className="nav-item nav-link">
                      Targets
                    </Link>
                  )}
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Create/Edit
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <Link to="/recipes" className="dropdown-item">
                        Recipe
                      </Link>
                      <Link to="/foods" className="dropdown-item">
                        Food
                      </Link>
                      <Link to="/exercises" className="dropdown-item">
                        Exercise
                      </Link>
                    </div>
                  </li>
                </React.Fragment>
              )}
              {isAdmin && (
                <React.Fragment>
                  <Link to="/foods" className="nav-item nav-link">
                    Foods
                  </Link>
                  <Link to="/exercises" className="nav-item nav-link">
                    Exercises
                  </Link>
                </React.Fragment>
              )}
              <a onClick={this.logout} className="nav-item nav-link">
                Logout
              </a>
            </div>
          </nav>
        )}
        <PrivateRoute
          path="/userprofile"
          roles={[Role.User, Role.Premium]}
          component={UserProfile}
        />
        <PrivateRoute
          path="/dashboard"
          roles={[Role.User, Role.Premium]}
          component={DashboardPage}
        />
        <PrivateRoute
          path="/recipes"
          roles={[Role.User, Role.Premium]}
          component={RecipePage}
        />
        <PrivateRoute
          path="/foods"
          roles={[Role.User, Role.Premium, Role.Admin]}
          component={FoodPage}
        />
        <PrivateRoute
          path="/exercises"
          roles={[Role.User, Role.Premium, Role.Admin]}
          component={ExercisePage}
        />
        <PrivateRoute
          path="/targets"
          roles={[Role.Premium]}
          component={TargetsPage}
        />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
      </Router>
    );
  }
}

export { App };
