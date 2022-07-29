import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'roles',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./roles/roles.module').then((m) => m.RolesModule),
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    component: ChatComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
