import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged: Subject<Recipe[]> = new Subject();
  recipes = [
    new Recipe(
      'Bacon & roast onion salad',
      'A rustic salad for one - contrast peas and caramelised onion with salty, streaky bacon and mustard dressing',
      'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--1284463_8.jpg?itok=ppdZiu1L',
      [
        new Ingredient('Bacon', 2),
        new Ingredient('Red onion', 1),
        new Ingredient('Olive oil', 2)
      ]
    ),
    new Recipe(
      'Garlic bacon butties',
      'You\'ll need good, crusty white bread for these instant hangover cures',
      'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--8137_11.jpg?itok=bqyVDxvl',
      [
        new Ingredient('Rashers rindless back bacon', 6),
        new Ingredient('White country loaf', 1)
      ]
    )
  ];

  constructor(private slService: ShoppingListService) {
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addRecipeIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
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
