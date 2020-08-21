import { authenticationService } from "../services/authentication.service";

export function authHeader(methodType) {
  const currentUser = authenticationService.currentUserValue;
  if (currentUser && currentUser.token) {
    if (methodType === "POST" || methodType === "PUT") {
      return {
        Authorization: `${currentUser.token}`,
        "Content-Type": "application/json",
      };
    } else {
      return { Authorization: `${currentUser.token}` };
    }
  } else {
    return {};
  }
}
