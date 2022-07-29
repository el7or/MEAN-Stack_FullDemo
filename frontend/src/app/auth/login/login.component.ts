import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  subs = new Subscription();

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.subs.add(this.authService.getAuthStatusListener.subscribe(
      authStatus => {
        this.isLoading = false;
      }
    ));
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.name, form.value.password);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
