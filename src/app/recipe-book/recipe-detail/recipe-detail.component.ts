import { Component, Input, OnInit } from "@angular/core";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import * as recipeBookActions from "../store/recipe-book.actions";
import * as shoppingListActions from "../../shopping-list/store/shopping-list.actions";
import { map, switchMap } from "rxjs/operators";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.scss"]
})
export class RecipeDetailComponent implements OnInit {
  detailedRecipe: Recipe;
  id: number;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => {
          return +params.id;
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select("recipeBook").pipe(
            map(state => {
              return state.recipes.find((recipe, idx) => idx === this.id);
            })
          );
        })
      )
      .subscribe(recipe => {
        this.detailedRecipe = recipe;
      });

    // this.route.params.subscribe(params => {
    //   this.id = +params.id;
    //   this.detailedRecipe = this.recipeService.getRecipe(this.id);
    //   this.store
    //     .select("recipeBook")
    //     .pipe(
    //       map(state => {
    //         return state.recipes.find((recipe, idx) => idx === this.id);
    //       })
    //     )
    //     .subscribe(recipe => {
    //       this.detailedRecipe = recipe;
    //     });
    // });
  }

  onAddToShoppingList() {
    this.store.dispatch(
      new shoppingListActions.AddIngredients(this.detailedRecipe.ingredients)
    );
  }

  onRecipeEdit() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onRecipeDelete() {
    this.store.dispatch(new recipeBookActions.DeleteRecipe(this.id));
    this.router.navigate(["/recipe-book"]);
  }
}
