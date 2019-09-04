import {Component, OnInit} from '@angular/core';
import {Recipe} from './recipe.model';
import {RecipeService} from './recipe.service';
import {DataStorageService} from '../shared/data-storage.service';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.scss']
})
export class RecipeBookComponent implements OnInit {
  constructor(
    private recipeService: RecipeService,
    private dataStorageService: DataStorageService
  ) {
  }

  ngOnInit() {
    this.dataStorageService.fetchData().subscribe();
  }
}
