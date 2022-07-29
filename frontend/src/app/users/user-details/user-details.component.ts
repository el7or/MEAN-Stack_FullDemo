import { Component, OnInit } from '@angular/core';

import { User } from './../../auth/auth.model';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  currentUser?: User;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser;
  }

}
