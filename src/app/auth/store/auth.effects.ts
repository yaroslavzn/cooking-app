import { Actions, ofType, Effect } from "@ngrx/effects";
import * as AuthActions from "./auth.actions";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface IAuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const authHandler = (
  email: string,
  id: string,
  token: string,
  expireIn: number
) => {
  const currentTime = new Date().getTime();
  const expiresIn = new Date(currentTime + expireIn * 1000);
  const user = new User(email, id, token, expiresIn);

  localStorage.setItem("userData", JSON.stringify(user));

  return new AuthActions.Authenticate({
    email,
    id,
    token,
    expireIn: expiresIn
  });
};

const errorHandler = error => {
  let errorMessage = "Unknown error occurred";

  if (!error.error || !error.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch (error.error.error.message) {
    case "EMAIL_EXISTS":
      errorMessage = "The email address is already in use by another account.";
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

  return of(new AuthActions.AuthenticateFail(errorMessage));
};

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
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);

            return authHandler(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          }),
          catchError(error => {
            return errorHandler(error);
          })
        );
    })
  );

  @Effect({
    dispatch: false
  })
  signinRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE),
    tap(() => {
      this.router.navigate(["/"]);
    })
  );

  @Effect({
    dispatch: false
  })
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem("userData");
      this.router.navigate(["/auth"]);
    })
  );

  @Effect()
  signupStart = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this.http
        .post<IAuthResponseData>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          map(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);

            return authHandler(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          }),
          catchError(error => {
            return errorHandler(error);
          })
        );
    })
  );

  @Effect()
  autologin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const loadedUser: {
        email: string;
        id: string;
        _token: string;
        _tokenExpiresIn: string;
      } = JSON.parse(localStorage.getItem("userData"));

      if (loadedUser) {
        const user = new User(
          loadedUser.email,
          loadedUser.id,
          loadedUser._token,
          new Date(loadedUser._tokenExpiresIn)
        );

        if (user.token) {
          const expiresDate =
            new Date(loadedUser._tokenExpiresIn).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expiresDate);

          return new AuthActions.Authenticate({
            email: loadedUser.email,
            id: loadedUser.id,
            token: loadedUser._token,
            expireIn: new Date(loadedUser._tokenExpiresIn)
          });
        }

        return { type: "DUMMY" };
      } else {
        return { type: "DUMMY" };
      }
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
