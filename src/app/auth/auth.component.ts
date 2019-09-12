import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  OnInit
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService, IAuthResponseData } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html"
})
export class AuthComponent implements OnDestroy, OnInit {
  isLoggingMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;
  alert$: Subscription;
  storeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select("auth").subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.errorMessage;

      if (this.error) {
        this.openErrorAlert(this.error);
      }
    });
  }

  switchMode() {
    this.isLoggingMode = !this.isLoggingMode;
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    if (this.isLoggingMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignupStart({ email: email, password: password })
      );
    }

    form.reset();
  }

  onCloseAlert() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  openErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );

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

    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
