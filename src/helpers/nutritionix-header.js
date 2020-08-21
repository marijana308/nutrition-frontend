export function nutritionixHeader(methodType) {
  // return header with x-app-key and x-app-id
  if (methodType === "POST") {
    return {
      "x-app-id": "d4f8ab6c",
      "x-app-key": "d8be2d9a331ca44c72571717412ca09d",
      "Content-Type": "application/json",
    };
  } else {
    return {
      "x-app-id": "d4f8ab6c",
      "x-app-key": "d8be2d9a331ca44c72571717412ca09d",
    };
  }
}
