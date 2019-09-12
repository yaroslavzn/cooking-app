import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "recipe-book",
    pathMatch: "full"
  },
  {
    path: "recipe-book",
    loadChildren: "./recipe-book/recibe-book.module#RecibeBookModule"
  },
  {
    path: "shopping-list",
    loadChildren: "./shopping-list/shopping-list.module#ShoppingListModule"
  },
  {
    path: "auth",
    loadChildren: "./auth/auth.module#AuthModule"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
