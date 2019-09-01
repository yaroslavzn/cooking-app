import {NgModule} from '@angular/core';

import {RecipeBookComponent} from './recipe-book.component';
import {RecipeDetailComponent} from './recipe-detail/recipe-detail.component';
import {RecipeEditComponent} from './recipe-edit/recipe-edit.component';
import {RecipeListComponent} from './recipe-list/recipe-list.component';
import {RecipeItemComponent} from './recipe-list/recipe-item/recipe-item.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {RecipeBookRoutingModule} from './recipe-book-routing.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    RecipeBookComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RecipeListComponent,
    RecipeItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    RecipeBookRoutingModule,
    SharedModule
  ]
})
export class RecibeBookModule {

}
