export function validateNumber(e) {
  if (!e.target.value.match(/^[0-9]+$/)) {
    return false;
  } else {
    return true;
  }
}

export function validateNotEmpty(e) {
  if (e.target.value === "") {
    return false;
  } else {
    return true;
  }
}

export function areErrorsEmpty(err) {
  if (Object.keys(err).length === 0) {
    return false;
  } else {
    return true;
  }
}
