import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, Subject, throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';

export interface IAuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChanged = new BehaviorSubject<User>(null);
  autoLogoutTimer;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  signUp(email: string, password: string) {
    return this.http.post<IAuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBq3hjIKNj8Zb6zcqPTn44lUsze9AY13_E', {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(responseData => {
        this.handlerAuthResponse(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      })
    );
  }

  logIn(email: string, password: string) {
    return this.http.post<IAuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBq3hjIKNj8Zb6zcqPTn44lUsze9AY13_E', {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(responseData => {
        this.handlerAuthResponse(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      })
    );
  }

  logOut() {
    this.authChanged.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    clearTimeout(this.autoLogoutTimer);
    this.autoLogoutTimer = null;
  }

  autoLogin() {
    const loadedUser: { email: string, id: string, _token: string, _tokenExpiresIn: string } = JSON.parse(localStorage.getItem('userData'));

    if (loadedUser) {
      const user = new User(loadedUser.email, loadedUser.id, loadedUser._token, new Date(loadedUser._tokenExpiresIn));

      if (user.token) {
        const expiresIn = new Date(loadedUser._tokenExpiresIn).getTime() - new Date().getTime();
        console.log(expiresIn);
        this.autoLogout(expiresIn);
        this.authChanged.next(user);
      }
    }
  }

  autoLogout(duration) {
    this.autoLogoutTimer = setTimeout(() => {
      this.logOut();
    }, duration);
  }

  handleError(error) {
    let errorMessage = 'Unknown error occurred';

    if (!error.error || !error.error.error) {
      return throwError(errorMessage);
    }

    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password.';
        break;
    }

    return throwError(errorMessage);
  }

  handlerAuthResponse(email: string, id: string, token: string, expires: number) {
    const expiresIn = new Date(new Date().getTime() + (expires * 1000));
    const user = new User(email, id, token, expiresIn);

    this.authChanged.next(user);
    this.autoLogout(expires * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
