import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RecipeService } from "../recipe.service";
import { Recipe } from "../recipe.model";
import { Store } from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import * as recipeBookActions from "../store/recipe-book.actions";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.scss"]
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  editMode = false;
  editedRecipeId;
  storeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe(data => {
      if (data.id) {
        this.editMode = true;
      }

      this.editedRecipeId = data.id ? +data.id : null;

      this.initForm();
    });
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  initForm() {
    let recipeName = null;
    let recipeDescription = null;
    let recipeImagePath = null;
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store
        .select("recipeBook")
        .pipe(
          map(state => {
            return state.recipes.find(
              (recipe, idx) => idx === this.editedRecipeId
            );
          })
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;

          if (recipe.ingredients) {
            for (const ingredientItem of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredientItem.name, [
                    Validators.required
                  ]),
                  amount: new FormControl(ingredientItem.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ])
                })
              );
            }
          }
        });
    }

    this.form = new FormGroup({
      name: new FormControl(recipeName, [Validators.required]),
      imagePath: new FormControl(recipeImagePath, [Validators.required]),
      recipeDescription: new FormControl(recipeDescription, [
        Validators.required
      ]),
      ingredients: recipeIngredients
    });
  }

  get ingredients() {
    return (this.form.get("ingredients") as FormArray).controls;
  }

  onAddIngredient() {
    (this.form.get("ingredients") as FormArray).push(
      new FormGroup({
        name: new FormControl(null, [Validators.required]),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onRemoveIngredient(i) {
    (this.form.get("ingredients") as FormArray).removeAt(i);
  }

  onSubmit() {
    const recipe = new Recipe(
      this.form.value.name,
      this.form.value.recipeDescription,
      this.form.value.imagePath,
      this.form.value.ingredients
    );

    if (this.editMode) {
      this.store.dispatch(
        new recipeBookActions.UpdateRecipe({
          idx: this.editedRecipeId,
          recipe: recipe
        })
      );
    } else {
      this.store.dispatch(new recipeBookActions.AddRecipe(recipe));
    }

    this.onCancel();
  }

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
