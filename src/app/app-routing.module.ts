import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipeBookComponent} from './recipe-book/recipe-book.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {RecipeDetailComponent} from './recipe-book/recipe-detail/recipe-detail.component';
import {RecipeEditComponent} from './recipe-book/recipe-edit/recipe-edit.component';
import {RecipesResolverService} from "./recipe-book/recipes-resolver.service";
import {AuthComponent} from './auth/auth.component';

const appRoutes: Routes = [
  {
    path: 'recipe-book',
    component: RecipeBookComponent,
    resolve: {
      recipesResolver: RecipesResolverService
    },
    children: [
      {
        path: 'new',
        component: RecipeEditComponent
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: {
          recipesResolver: RecipesResolverService
        }
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: {
          recipesResolver: RecipesResolverService
        }
      }
    ]
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: '',
    redirectTo: 'recipe-book',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
