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
      "https://cdn.pixabay.com/photo/2014/10/22/16/38/ingredients-498199_960_720.jpg"
    ),
    new Recipe(
      "Test recipe",
      "Simple description",
      "https://cdn.pixabay.com/photo/2014/10/22/16/38/ingredients-498199_960_720.jpg"
    )
  ];
  constructor() {}

  ngOnInit() {}
}
