import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";

import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";
import { Subscription } from "rxjs";
import { DataStorageService } from "../../shared/data-storage.service";
import { Store } from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.scss"]
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  s1$: Subscription;
  isLoading = false;

  constructor(
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.s1$ = this.store.select("recipeBook").subscribe(state => {
      this.recipes = state.recipes;
      this.isLoading = false;
    });

    // this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.s1$.unsubscribe();
  }
}
