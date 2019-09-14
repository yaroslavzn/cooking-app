import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { Observable, of, from } from "rxjs";

import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import { Actions, ofType } from "@ngrx/effects";
import * as recipeBookActions from "../recipe-book/store/recipe-book.actions";
import { map, take, switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  isRecipesFetched = false;
  constructor(
    private dataStorageService: DataStorageService,
    private recipeServices: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    return this.store.select("recipeBook").pipe(
      take(1),
      map(recipeBookState => {
        return recipeBookState.recipes;
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new recipeBookActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(recipeBookActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );
  }
}
