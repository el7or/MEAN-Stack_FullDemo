import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";

import { AuthData, LoginResponse, User } from './auth.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/api/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper = new JwtHelperService();

  private token!: string | null;
  public get getToken(): string {
    return this.token!;
  }

  private isAuthenticated = false;
  public get getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  private authStatusListener = new BehaviorSubject<boolean>(false);
  public get getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  private tokenTimer: any;
  private setTokenTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private userId!: string;
  public get getUserId(): string {
    return this.userId;
  }

  private roleName!: string;
  public get getRoleName(): string {
    return this.roleName;
  }

  private currentUser!: User;
  public get getCurrentUser(): User {
    return this.currentUser;
  }

  constructor(private http: HttpClient, private router: Router) { }

  login(name: string, password: string) {
    const authData: AuthData = { name: name, password: password };
    this.http.post<LoginResponse>(BACKEND_URL + "/login", authData)
      .subscribe({
        next: response => {
          const token = response.token;
          this.token = token;
          if (this.token) {
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const expiresInDuration = response.expiresIn;
            this.setTokenTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate);
            const decodedToken = this.jwtHelper.decodeToken(this.token);
            this.userId = decodedToken.userId;
            this.roleName = decodedToken.roleName;
            this.currentUser = response.user;
            this.router.navigate(["/users"]);
          }
        },
        error: error => {
          console.error(error);
          this.authStatusListener.next(false);
        }
      });
  }

  signup(name: string, password: string, image: File) {
    const authData = new FormData();
    authData.append("name", name);
    authData.append("password", password);
    authData.append("image", image, name);
    this.http.post<{ message: string; result: User }>(BACKEND_URL + "/signup", authData)
      .subscribe({
        next: response => {
          this.router.navigate(["/auth/login"]);
        },
        error: error => {
          console.error(error);
          this.authStatusListener.next(false);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      this.userId = decodedToken.userId;
      this.roleName = decodedToken.roleName;
      this.isAuthenticated = true;
      this.setTokenTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
}
