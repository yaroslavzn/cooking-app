import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit {
  @Output() itemAdded: EventEmitter<Ingredient> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onItemAdd(name, amount) {
    const ingredient: Ingredient = {
      name,
      amount: +amount
    };

    this.itemAdded.emit(ingredient);
  }
}
