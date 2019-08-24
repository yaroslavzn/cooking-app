import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  s1$: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedIngredient: Ingredient;
  @ViewChild('form', {static: false}) ingredientForm: NgForm;

  constructor(private slService: ShoppingListService) {
  }

  ngOnInit() {
    this.s1$ = this.slService.editIngredient
      .subscribe(id => {
        this.editedItemIndex = id;
        this.editMode = true;
        this.editedIngredient = this.slService.getIngredient(id);

        this.ingredientForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      });
  }

  onItemAdd(form: NgForm) {
    const value = form.value;
    const ingredient: Ingredient = {
      name: value.name,
      amount: +value.amount
    };

    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, ingredient);
    } else {
      this.slService.addIngredient(ingredient);
    }

    this.resetForm();
  }

  ngOnDestroy(): void {
    this.s1$.unsubscribe();
  }

  resetForm() {
    this.editMode = false;
    this.ingredientForm.reset();
  }

  onDelete() {
    if (this.editMode) {
      this.slService.removeIngredient(this.editedItemIndex);
      this.resetForm();
    }
  }
}
