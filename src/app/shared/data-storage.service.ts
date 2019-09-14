import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { exhaustMap, map, take, tap } from "rxjs/operators";

import { RecipeService } from "../recipe-book/recipe.service";
import { Recipe } from "../recipe-book/recipe.model";
import { AuthService } from "../auth/auth.service";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as recipeBookActions from "../recipe-book/store/recipe-book.actions";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  saveData() {
    const recipes = this.recipeService.getRecipes();

  }

  fetchData() {
    this.store.dispatch(new recipeBookActions.FetchRecipes());
  }
}
