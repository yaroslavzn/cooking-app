import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

interface IAuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient
  ) {
  }

  signUp(email: string, password: string) {
    return this.http.post<IAuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBq3hjIKNj8Zb6zcqPTn44lUsze9AY13_E', {
      email,
      password,
      returnSecureToken: true
    })
      .pipe(catchError(error => {
        let errorMessage = 'Unknown error occurred';

        if (!error.error || !error.error.error) {
          return throwError(errorMessage);
        }

        switch (error.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'The email address is already in use by another account.';
            break;
        }

        return throwError(errorMessage);
      }));
  }
}
