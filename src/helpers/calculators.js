export function calcNutr(nutrient, base, chosenFood) {
  if (nutrient === "calories") {
    return Math.round(base * chosenFood.nf_calories);
  }
  if (nutrient === "carbs") {
    return Number((base * chosenFood.nf_total_carbohydrate).toFixed(2));
  }
  if (nutrient === "protein") {
    return Number((base * chosenFood.nf_protein).toFixed(2));
  }
  if (nutrient === "totalFat") {
    return Number((base * chosenFood.nf_total_fat).toFixed(2));
  }
  if (nutrient === "saturatedFat") {
    return Number((base * chosenFood.nf_saturated_fat).toFixed(2));
  }
  if (nutrient === "cholesterol") {
    return Number((base * chosenFood.nf_cholesterol).toFixed(2));
  }
  if (nutrient === "sodium") {
    return Number((base * chosenFood.nf_sodium).toFixed(2));
  }
  if (nutrient === "fiber") {
    return Number((base * chosenFood.nf_dietary_fiber).toFixed(2));
  }
  if (nutrient === "sugars") {
    return Number((base * chosenFood.nf_sugars).toFixed(2));
  }
  if (nutrient === "potasium") {
    return Number((base * chosenFood.nf_potassium).toFixed(2));
  }
  return 0;
}

export function calcCustomNutr(nutrient, base, chosenFood) {
  if (nutrient === "calories") {
    return Math.round(base * chosenFood.calories);
  }
  if (nutrient === "carbs") {
    return Number((base * chosenFood.totalCarbs).toFixed(2));
  }
  if (nutrient === "protein") {
    return Number((base * chosenFood.protein).toFixed(2));
  }
  if (nutrient === "totalFat") {
    return Number((base * chosenFood.totalFat).toFixed(2));
  }
  if (nutrient === "saturatedFat") {
    return Number((base * chosenFood.saturatedFat).toFixed(2));
  }
  if (nutrient === "cholesterol") {
    return Number((base * chosenFood.cholesterol).toFixed(2));
  }
  if (nutrient === "sodium") {
    return Number((base * chosenFood.sodium).toFixed(2));
  }
  if (nutrient === "fiber") {
    return Number((base * chosenFood.fiber).toFixed(2));
  }
  if (nutrient === "sugars") {
    return Number((base * chosenFood.sugars).toFixed(2));
  }
  if (nutrient === "potasium") {
    return Number((base * chosenFood.potasium).toFixed(2));
  }
  return 0;
}

export function sumArray(items, prop) {
  return items.reduce(function (a, b) {
    return a + b[prop];
  }, 0);
}

export function totalNutrient(
  breakfast,
  lunch,
  dinner,
  snack,
  exercises,
  appOrCustomExercises,
  nutrient
) {
  const breakfastSum =
    sumArray(breakfast.chosenFoods, nutrient) +
    sumArray(breakfast.appOrCustomFoods, nutrient);
  const lunchSum =
    sumArray(lunch.chosenFoods, nutrient) +
    sumArray(lunch.appOrCustomFoods, nutrient);
  const dinnerSum =
    sumArray(dinner.chosenFoods, nutrient) +
    sumArray(dinner.appOrCustomFoods, nutrient);
  const snacksSum =
    sumArray(snack.chosenFoods, nutrient) +
    sumArray(snack.appOrCustomFoods, nutrient);
  let total = breakfastSum + lunchSum + dinnerSum + snacksSum;
  if (nutrient === "calories") {
    const calBurned =
      sumArray(exercises, "nf_calories") +
      sumArray(appOrCustomExercises, "caloriesBurned");
    total = total - calBurned;
  }
  return Number(total.toFixed(2));
}

export function totalNutrientInRecipe(
  nutritionixFoods,
  appOrCustomFoods,
  nutrient
) {
  const nutrientSum =
    sumArray(nutritionixFoods, nutrient) + sumArray(appOrCustomFoods, nutrient);
  return Number(nutrientSum.toFixed(2));
}
