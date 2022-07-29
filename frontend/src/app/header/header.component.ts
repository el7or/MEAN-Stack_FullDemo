import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  subs = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth;
    this.subs.add(this.authService
      .getAuthStatusListener
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }))
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
