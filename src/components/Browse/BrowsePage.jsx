import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { authHeader } from "../../helpers/auth-header";
import BrowseRow from "./BrowseRow";
import { authenticationService } from "../../services/authentication.service";
import { Role } from "../../helpers/role";

export class BrowsePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      data: [],
      perPage: 10,
      currentPage: 0,
      browseType: "customFoods",
      postData: [],
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  changeBrowseType(e) {
    this.setState({ browseType: e.target.value }, () => {
      this.receivedData();
    });
  }

  receivedData() {
    const requestOptions = { method: "GET", headers: authHeader("GET") };
    let url = "";
    let exercise = false;
    if (this.state.browseType === "appFoods") {
      url = `http://localhost:8080/api/foods/allAdmin`;
    }
    if (this.state.browseType === "customFoods") {
      url = `http://localhost:8080/api/foods/all/${authenticationService.currentUserValue.username}`;
    }
    if (this.state.browseType === "customRecipes") {
      url = `http://localhost:8080/api/recipes/all/${authenticationService.currentUserValue.username}`;
    }
    if (this.state.browseType === "customExercises") {
      url = `http://localhost:8080/api/exercises/all/${authenticationService.currentUserValue.username}`;
      exercise = true;
    }
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        const data = res;
        const slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        const postData = slice.map((pd) => (
          <React.Fragment>
            <BrowseRow obj={pd} exercise={exercise}></BrowseRow>
          </React.Fragment>
        ));

        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),

          postData: postData,
        });
      });
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.receivedData();
      }
    );
  };

  componentDidMount() {
    this.receivedData();
  }

  tableHeader() {
    if (this.state.browseType === "customExercises") {
      return (
        <tr>
          <td>name</td>
          <td>time</td>
          <td>calories burned</td>
        </tr>
      );
    } else {
      if (authenticationService.currentUserValue.role === "REGULAR") {
        return (
          <tr>
            <td>food</td>
            <td>calories</td>
            <td>carbs</td>
            <td>total fat</td>
            <td>protein</td>
          </tr>
        );
      } else {
        return (
          <tr>
            <td>food</td>
            <td>calories</td>
            <td>carbs</td>
            <td>sugars</td>
            <td>total fat</td>
            <td>sat. fat</td>
            <td>cholesterol</td>
            <td>protein</td>
            <td>sodium</td>
            <td>potasium</td>
            <td>fiber</td>
          </tr>
        );
      }
    }
  }

  style = {
    container: {
      marginTop: "200px",
    },
  };

  render() {
    const isPremium =
      authenticationService.currentUserValue.role === Role.Premium;
    return (
      <div className="myContainer">
        <div className="browseContainer">
          <select
            className="searchTypeSelect"
            name="browseType"
            onChange={(e) => this.changeBrowseType(e)}
          >
            <option value="customFoods">custom foods</option>
            <option value="customRecipes">custom recipes</option>
            <option value="customExercises">custom exercises</option>
            {/* <option value="appFoods">app foods</option> */}
          </select>
          <table className={isPremium ? "premiumTable" : "regularTable"}>
            <tbody>
              {this.tableHeader()}
              {this.state.postData}
              {this.state.postData.length < 1 && (
                <tr>
                  <td colSpan="15">Nothing created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    );
  }
}

export default BrowsePage;
