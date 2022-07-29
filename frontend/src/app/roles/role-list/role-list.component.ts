import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import openSocket from 'socket.io-client';
import { environment } from 'src/environments/environment';

import { HttpResponse, Role } from '../role.model';
import { RolesService } from '../roles.service';
import { AuthService } from './../../auth/auth.service';

const BACKEND_URL = environment.apiUrl;

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, OnDestroy {
  isLoading = false;
  roles: Role[] = [];
  totalRoles = 0;
  rolesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isUserAdmin: boolean = false;
  subs = new Subscription();

  constructor(private rolesService: RolesService,
    private authService: AuthService) {
    this.isUserAdmin = this.authService.getRoleName === 'Admin';
  }

  ngOnInit() {
    this.subs.add(this.authService.getAuthStatusListener.subscribe(
      authStatus => {
        this.isLoading = false;
      }
    ));
    this.implementRoles();
    const socket = openSocket(BACKEND_URL, { transports: ['websocket'] });
    socket.on('modifyRoles', data => {
      if (data.action === 'create') {
        this.addRole(data.role);
      } else if (data.action === 'update') {
        this.updateRole(data.role);
      } else if (data.action === 'delete') {
        this.implementRoles();
      }
    });
  }

  addRole(role: Role) {
    if (this.roles.length < this.rolesPerPage)
      this.roles.push(role);
    this.totalRoles++;
  }

  updateRole(role: Role) {
    const updatedRoleIndex = this.roles.findIndex(r => r._id === role._id);
    if (updatedRoleIndex > -1) {
      this.roles[updatedRoleIndex] = role;
    }
  }

  implementRoles() {
    this.isLoading = true;
    this.subs.add(this.rolesService.getRoles(this.rolesPerPage, this.currentPage)
      .subscribe({
        next: (data: HttpResponse) => {
          this.roles = data.result;
          this.totalRoles = data.totalItems!;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      }));
  }

  onDelete(roleId: string) {
    this.isLoading = true;
    this.rolesService.deleteRole(roleId)
      .subscribe({
        next: (data: HttpResponse) => {
          this.currentPage = 1;
          this.implementRoles();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.rolesPerPage = pageData.pageSize;
    this.implementRoles();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
