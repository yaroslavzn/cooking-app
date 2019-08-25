import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipeService} from '../recipe.service';
import {Recipe} from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  form: FormGroup;
  editMode = false;
  editedRecipeId;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(data => {
        if (data.id) {
          this.editMode = true;
        }

        this.editedRecipeId = data.id ? +data.id : null;

        this.initForm();
      });
  }

  initForm() {
    let recipeName = null;
    let recipeDescription = null;
    let recipeImagePath = null;
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.editedRecipeId);

      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if (recipe.ingredients) {
        for (const ingredientItem of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredientItem.name, [Validators.required]),
              'amount': new FormControl(ingredientItem.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }

    this.form = new FormGroup({
      'name': new FormControl(recipeName, [Validators.required]),
      'imagePath': new FormControl(recipeImagePath, [Validators.required]),
      'recipeDescription': new FormControl(recipeDescription, [Validators.required]),
      'ingredients': recipeIngredients
    });
  }

  get ingredients() {
    return (this.form.get('ingredients') as FormArray).controls;
  }

  onAddIngredient() {
    (this.form.get('ingredients') as FormArray).push(new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onRemoveIngredient(i) {
    this.ingredients.splice(i, 1);
  }

  onSubmit() {
    const recipe = new Recipe(
      this.form.value.name,
      this.form.value.recipeDescription,
      this.form.value.imagePath,
      this.form.value.ingredients
    );

    if (this.editMode) {
      this.recipeService.updateRecipe(this.editedRecipeId, recipe);
    } else {
      this.recipeService.addRecipe(recipe);
    }

    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
