import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';

import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged: Subject<Recipe[]> = new Subject();
  recipes: Recipe[] = [];

  constructor(
    private slService: ShoppingListService,
    private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
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
    // this.slService.addIngredients(ingredients);
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
