// ====================================================

// Doc
// ====================================================

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthService } from './shared/service/auth.service';
import { AuthGuardGuard } from './shared/service/auth-guard.guard';
import { ProductsComponent } from './product/products/products.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryDetailsComponent } from './inventory/inventory-details/inventory-details.component';
import { InventoryProcureComponent } from './inventory/inventory-procure/inventory-procure.component';
import { RolesComponent } from './admin/role/roles/roles.component';
import { RoleDetailsComponent } from './admin/role/role-details/role-details.component';
import { TeamsComponent } from './admin/team/teams/teams.component';
import { TeamDetailsComponent } from './admin/team/team-details/team-details.component';
import { UsersComponent } from './admin/user/users/users.component';
import { UserDetailsComponent } from './admin/user/user-details/user-details.component';
import { MissionsComponent } from './mission/missions/missions.component';
import { MissionDetailsComponent } from './mission/mission-details/mission-details.component';



@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: HomeComponent, canActivate: [AuthGuardGuard], data: { title: 'Home' } },

      { path: 'products', component: ProductsComponent, canActivate: [AuthGuardGuard], data: { title: 'Products' } },
      { path: 'products/add', component: ProductDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'Product' } },
      { path: 'products/details/:id', component: ProductDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'Product' } },

      { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuardGuard], data: { title: 'Inventory' } },
      { path: 'inventory/add', component: InventoryProcureComponent, canActivate: [AuthGuardGuard], data: { title: 'Inventory' } },
      { path: 'inventory/details/:id', component: InventoryDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'Inventory' } },

      {
        path: 'admin', canActivateChild: [AuthGuardGuard],
        children: [
          { path: 'roles', component: RolesComponent, canActivate: [AuthGuardGuard], data: { title: 'Roles' } },
          { path: 'roles/add', component: RoleDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'Role' } },
          { path: 'roles/details/:id', component: RoleDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'Role' } },

          { path: 'teams', component: TeamsComponent, canActivate: [AuthGuardGuard], data: { title: 'Teams' } },
          { path: 'teams/add', component: TeamDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'Team' } },
          { path: 'teams/details/:id', component: TeamDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'Team' } },

          { path: 'users', component: UsersComponent, canActivate: [AuthGuardGuard], data: { title: 'Users' } },
          { path: 'users/add', component: UserDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'User' } },
          { path: 'users/details/:id', component: UserDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'User' } },

          { path: 'mission', component: MissionsComponent, canActivate: [AuthGuardGuard], data: { title: 'Mission' } },
          { path: 'mission/add', component: MissionDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'Mission' } },
          { path: 'mission/details/:id', component: MissionDetailsComponent, canActivate: [AuthGuardGuard], data: { title: 'Mission' } }
        ]
      },
      { path: 'login', component: LoginComponent, data: { title: 'Login' } },

      { path: 'home', redirectTo: '/', pathMatch: 'full', canActivate: [AuthGuardGuard] },
      { path: '**', component: NotFoundComponent, data: { title: 'Page Not Found' } },
    ])
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthService, AuthGuardGuard
  ]
})
export class AppRoutingModule { }
