import {EventEmitter, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';

import {Ingredient} from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged: Subject<Ingredient[]> = new Subject();
  editIngredient: Subject<number> = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 7),
    new Ingredient('Tomatoes', 12)
  ];

  constructor(private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) {
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    // this.ingredients[index] = newIngredient;
    // this.ingredientsChanged.next(this.ingredients.slice());
    this.store.dispatch(new ShoppingListActions.UpdateIngredient({index, ingredient: newIngredient}));
  }

  removeIngredient(index: number) {
    // this.ingredients.splice(index, 1);
    // this.ingredientsChanged.next(this.ingredients.slice());
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(index));
  }
}
