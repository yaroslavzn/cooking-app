import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';

import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged: Subject<Recipe[]> = new Subject();
  recipes: Recipe[] = [];

  constructor(
    private store: Store<fromShoppingList.AppState>
  ) {
  }

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next([...this.recipes]);
  }

  addRecipeIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(idx: number, recipe: Recipe) {
    this.recipes[idx] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(idx: number) {
    this.recipes.splice(idx, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
