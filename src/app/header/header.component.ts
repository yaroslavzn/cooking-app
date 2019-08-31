import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {User} from '../auth/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  userSub$: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {
  }

  onSave() {
    this.dataStorageService.saveData();
  }

  onFetch() {
    this.dataStorageService.fetchData().subscribe();
  }

  ngOnInit(): void {
    this.userSub$ = this.authService.authChanged.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
  }

  onLogout() {
    this.authService.logOut();
  }
}
