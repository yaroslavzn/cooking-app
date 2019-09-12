import { NgModule } from "@angular/core";

import { RecipeBookComponent } from "./recipe-book.component";
import { AuthGuard } from "../auth/auth.guard";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipesResolverService } from "./recipes-resolver.service";
import { RouterModule } from "@angular/router";

const routes = [
  {
    path: "",
    component: RecipeBookComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "new",
        component: RecipeEditComponent
      },
      {
        path: ":id",
        component: RecipeDetailComponent,
        resolve: {
          recipesResolver: RecipesResolverService
        }
      },
      {
        path: ":id/edit",
        component: RecipeEditComponent,
        resolve: {
          recipesResolver: RecipesResolverService
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeBookRoutingModule {}
