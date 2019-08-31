import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {exhaustMap, map, take, tap} from 'rxjs/operators';

import {RecipeService} from '../recipe-book/recipe.service';
import {Recipe} from '../recipe-book/recipe.model';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {
  }

  saveData() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://cooking-app-76f01.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchData() {
    return this.http.get<Recipe[]>('https://cooking-app-76f01.firebaseio.com/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => this.recipeService.setRecipes(recipes))
      );
  }
}
