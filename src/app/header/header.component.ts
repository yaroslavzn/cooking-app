import { Component, OnDestroy, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";
import * as recipeBookActions from "../recipe-book/store/recipe-book.actions";
import { map } from "rxjs/operators";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  userSub$: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  onSave() {
    this.store.dispatch(new recipeBookActions.SaveRecipes());
  }

  onFetch() {
    this.store.dispatch(new recipeBookActions.FetchRecipes());
  }

  ngOnInit(): void {
    this.userSub$ = this.store
      .select("auth")
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
  }

  onLogout() {
    // this.authService.logOut();
    this.store.dispatch(new AuthActions.Logout());
  }
}
