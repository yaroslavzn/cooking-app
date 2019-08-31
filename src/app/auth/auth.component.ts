import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService, IAuthResponseData} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoggingMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  switchMode() {
    this.isLoggingMode = !this.isLoggingMode;
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    let authObs: Observable<IAuthResponseData>;

    if (this.isLoggingMode) {
      authObs = this.authService.logIn(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe(authResponse => {
      console.log(authResponse);
      this.isLoading = false;
      this.router.navigate(['/recipe-book']);
    }, (errorMessage) => {
      this.error = errorMessage;
      this.isLoading = false;

      setTimeout(() => {
        this.error = null;
      }, 6000);
    });

    form.reset();
  }
}
