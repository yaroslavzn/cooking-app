import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 7),
    new Ingredient('Tomatoes', 12)
  ];
  constructor() { }

  ngOnInit() {
  }

  onIngredientAdd(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }
}
