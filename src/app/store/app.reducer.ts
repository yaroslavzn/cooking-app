import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";
import * as fromAuth from "../auth/store/auth.reducer";
import * as fromRecipeBook from "../recipe-book/store/recipe-book.reducer";
import { ActionReducerMap } from "@ngrx/store";

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
  recipeBook: fromRecipeBook.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  recipeBook: fromRecipeBook.recipeBookReducer
};
