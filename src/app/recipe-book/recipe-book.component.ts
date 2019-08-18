import {Component, OnInit} from '@angular/core';
import {Recipe} from './recipe.model';
import {RecipeService} from './recipe.service';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.scss']
})
export class RecipeBookComponent implements OnInit {
  selectedRecipe: Recipe;

  constructor(
    private recipeService: RecipeService
  ) {
  }

  ngOnInit() {
    this.recipeService.selectedRecipe
      .subscribe(recipe => {
        this.selectedRecipe = recipe;
      });
  }
}
