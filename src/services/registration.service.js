import { handleResponse } from "../helpers/handle-response";
import { authenticationService } from "./authentication.service";

export const registrationService = {
  register,
};

function register(
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
) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
    }),
  };

  return fetch(`http://localhost:8080/api/register`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      authenticationService.login(username, password);
      console.log("registration service, response= " + res);
      console.log("registration service, responseJSON= " + JSON.stringify(res));
      return res;
    });
}
