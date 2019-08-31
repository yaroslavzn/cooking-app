import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {Subscription} from 'rxjs';
import {DataStorageService} from '../../shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  s1$: Subscription;
  isLoading = false;

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.s1$ = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
        this.isLoading = false;
      }
    );

    this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.s1$.unsubscribe();
  }
}
