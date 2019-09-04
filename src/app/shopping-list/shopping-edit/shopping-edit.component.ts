import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

import {Ingredient} from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  s1$: Subscription;
  editMode = false;
  @ViewChild('form', {static: false}) ingredientForm: NgForm;

  constructor(
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit() {
    this.s1$ = this.store.select('shoppingList').subscribe(state => {
      if (state.editedIngredientIndex > -1) {
        this.editMode = true;

        this.ingredientForm.setValue({
          name: state.editedIngredient.name,
          amount: state.editedIngredient.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onItemAdd(form: NgForm) {
    const value = form.value;
    const ingredient: Ingredient = {
      name: value.name,
      amount: +value.amount
    };

    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }

    this.resetForm();
  }

  ngOnDestroy(): void {
    this.s1$.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEditing());
  }

  resetForm() {
    this.editMode = false;
    this.ingredientForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEditing());
  }

  onDelete() {
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.DeleteIngredient());
      this.resetForm();
    }
  }
}
