import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { HttpResponse, Role } from './role.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/api/roles/";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  getRoles(rolesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${rolesPerPage}&page=${currentPage}`;
    return this.http.get<HttpResponse>(BACKEND_URL + queryParams);
  }

  getRole(roleId: string) {
    return this.http.get<HttpResponse>(BACKEND_URL + roleId);
  }

  addRole(name: string, description: string) {
    const role: Role = { name: name, description: description };
    return this.http.post<HttpResponse>(BACKEND_URL, role);
  }

  updateRole(id: string, name: string, description: string) {
    const role: Role = { _id: id, name: name, description: description };
    return this.http.put<HttpResponse>(BACKEND_URL + id, role);
  }

  deleteRole(roleId: string) {
    return this.http.delete<HttpResponse>(BACKEND_URL + roleId);
  }
}
