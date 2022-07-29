import { AuthService } from './../../auth/auth.service';
import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { HttpResponse, Role } from '../role.model';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit, OnDestroy {
  isLoading = false;
  roleId?: string;
  role?: Role;
  subs = new Subscription();

  constructor(private rolesService: RolesService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public location: Location) {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("roleId")) {
        this.roleId = paramMap.get("roleId")!;
      }
    });
  }

  ngOnInit(): void {
    this.subs.add(this.authService.getAuthStatusListener.subscribe(
      authStatus => {
        this.isLoading = false;
      }
    ));
    if (this.roleId) {
      this.isLoading = true;
      this.rolesService.getRole(this.roleId).subscribe({
        next: data => {
          this.role = data.result;
          this.isLoading = false;
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  onSaveRole(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (!this.roleId) { }
    this.subs.add(
      this.roleId ? this.updateRole(form) : this.addRole(form)
    );
  }

  addRole(form: NgForm) {
    return this.rolesService.addRole(form.value.name, form.value.description)
      .subscribe({
        next: (data: HttpResponse) => {
          form.resetForm();
          this.router.navigateByUrl('/roles');
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  updateRole(form: NgForm) {
    return this.rolesService.updateRole(this.roleId!, form.value.name, form.value.description)
      .subscribe({
        next: (data: HttpResponse) => {
          form.resetForm();
          this.router.navigateByUrl('/roles');
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
