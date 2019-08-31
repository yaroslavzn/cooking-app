import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService, IAuthResponseData} from './auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  isLoggingMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  alert$: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
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
      this.openErrorAlert(errorMessage);
      this.isLoading = false;
    });

    form.reset();
  }

  onCloseAlert() {
    this.error = null;
  }

  openErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const alertContainerRef = this.alertHost.viewContainerRef;
    alertContainerRef.clear();

    const componentRef = alertContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.error = message;

    this.alert$ = componentRef.instance.close.subscribe(() => {
      this.alert$.unsubscribe();
      alertContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.alert$) {
      this.alert$.unsubscribe();
    }
  }
}
