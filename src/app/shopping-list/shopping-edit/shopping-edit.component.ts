import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit {
  constructor(private slService: ShoppingListService) {
  }

  ngOnInit() {
  }

  onItemAdd(name, amount) {
    const ingredient: Ingredient = {
      name,
      amount: +amount
    };

    this.slService.addIngredient(ingredient);
  }
}
