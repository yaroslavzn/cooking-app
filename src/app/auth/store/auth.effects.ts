import { Actions, ofType, Effect } from "@ngrx/effects";
import * as AuthActions from "./auth.actions";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

export interface IAuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<IAuthResponseData>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
            environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          map(resData => {
            const expiresIn = new Date(
              new Date().getTime() + +resData.expiresIn * 1000
            );
            return new AuthActions.Login({
              email: resData.email,
              id: resData.localId,
              token: resData.idToken,
              expireIn: expiresIn
            });
          }),
          catchError(error => {
            let errorMessage = "Unknown error occurred";

            if (!error.error || !error.error.error) {
              return of(new AuthActions.LoginFail(errorMessage));
            }

            switch (error.error.error.message) {
              case "EMAIL_EXISTS":
                errorMessage =
                  "The email address is already in use by another account.";
                break;
              case "EMAIL_NOT_FOUND":
                errorMessage =
                  "There is no user record corresponding to this identifier. The user may have been deleted.";
                break;
              case "INVALID_PASSWORD":
                errorMessage =
                  "The password is invalid or the user does not have a password.";
                break;
            }

            return of(new AuthActions.LoginFail(errorMessage));
          })
        );
    })
  );

  @Effect({
    dispatch: false
  })
  authLogged = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(["/"]);
    })
  );
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
