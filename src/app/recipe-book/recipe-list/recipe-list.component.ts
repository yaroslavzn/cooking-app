import { Component, OnInit } from "@angular/core";

import { Recipe } from "../recipe.model";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.scss"]
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      "Test recipe",
      "Simple description",
      "https://www.momontimeout.com/wp-content/uploads/2018/11/chicken-stir-fry-733x1103.jpg"
    )
  ];
  constructor() {}

  ngOnInit() {}
}
