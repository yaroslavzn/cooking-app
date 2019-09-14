import { Recipe } from "../recipe.model";
import * as recipeBookActions from "./recipe-book.actions";

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function recipeBookReducer(
  state: State = initialState,
  action: recipeBookActions.RecipeActions
) {
  switch (action.type) {
    case recipeBookActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    case recipeBookActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case recipeBookActions.UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.idx],
        ...action.payload.recipe
      };

      const updatedRecipes = [...state.recipes];

      updatedRecipes[action.payload.idx] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes
      };
    case recipeBookActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, idx) => idx !== action.payload)
      };
    default:
      return state;
  }
}
