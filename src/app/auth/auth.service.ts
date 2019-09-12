import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

export interface IAuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  autoLogoutTimer;

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(duration) {
    this.autoLogoutTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, duration);
  }

  clearLogoutTimer() {
    clearTimeout(this.autoLogoutTimer);
    this.autoLogoutTimer = null;
  }
}
