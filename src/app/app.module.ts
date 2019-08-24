import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {RecipeBookComponent} from './recipe-book/recipe-book.component';
import {ShoppingEditComponent} from './shopping-list/shopping-edit/shopping-edit.component';
import {RecipeListComponent} from './recipe-book/recipe-list/recipe-list.component';
import {RecipeDetailComponent} from './recipe-book/recipe-detail/recipe-detail.component';
import {RecipeItemComponent} from './recipe-book/recipe-list/recipe-item/recipe-item.component';
import {DropdownDirective} from './shared/dropdown.directive';
import {AppRoutingModule} from './app-routing.module';
import {RecipeEditComponent} from './recipe-book/recipe-edit/recipe-edit.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShoppingListComponent,
    RecipeBookComponent,
    ShoppingEditComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    DropdownDirective,
    RecipeEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
