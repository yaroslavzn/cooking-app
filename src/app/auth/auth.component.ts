import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoggingMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService
  ) {
  }

  switchMode() {
    this.isLoggingMode = !this.isLoggingMode;
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    if (this.isLoggingMode) {
      //...
    } else {
      this.authService.signUp(email, password)
        .subscribe(authResponse => {
          console.log(authResponse);
          this.isLoading = false;
        }, (errorMessage) => {
          this.error = errorMessage;
          this.isLoading = false;

          setTimeout(() => {
            this.error = null;
          }, 3000);
        });
    }

    form.reset();
  }
}
