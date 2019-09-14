import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { switchMap, map, withLatestFrom } from "rxjs/operators";

import * as RecipeBookActions from "./recipe-book.actions";
import { Recipe } from "../recipe.model";
import { Store } from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";

@Injectable()
export class RecipeBookEffects {
  @Effect()
  fetchData = this.actions$.pipe(
    ofType(RecipeBookActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        "https://cooking-app-76f01.firebaseio.com/recipes.json"
      );
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipeBookActions.SetRecipes(recipes);
    })
  );

  @Effect({
    dispatch: false
  })
  saveData = this.actions$.pipe(
    ofType(RecipeBookActions.SAVE_RECIPES),
    withLatestFrom(this.store.select("recipeBook")),
    switchMap(([action, recipeBookState]) => {
      return this.http.put(
        "https://cooking-app-76f01.firebaseio.com/recipes.json",
        recipeBookState.recipes
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
