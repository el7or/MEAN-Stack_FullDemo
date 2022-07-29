import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RolesRoutingModule } from './roles-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { AngularMaterialModule } from './../angular-material.module';


@NgModule({
  declarations: [
    RoleListComponent,
    RoleFormComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    FormsModule,
    AngularMaterialModule
  ]
})
export class RolesModule { }
