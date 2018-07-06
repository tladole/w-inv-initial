import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastyModule } from 'ng2-toasty';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { AgGridModule } from 'ag-grid-angular';
import { LightboxModule } from 'angular2-lightbox';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AutofocusDirective } from './shared/directive/autofocus.directive';
import { DatepickerDirective } from './shared/directive/datepicker.directive';
import { SelectDirective } from './shared/directive/select.directive';
import { TabsetDirective } from './shared/directive/tabset.directive';
import { ToggleDirective } from './shared/directive/toggle.directive';
import { EqualValidatorDirective } from './shared/directive/equal-validator.directive';
import { LastElementDirective } from './shared/directive/last-element.directive';
import { GroupByPipe } from './shared/pipe/group-by.pipe';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppRoutingModule } from './app.routing';
import { AlertService } from './shared/service/alert.service';
import { ConfigurationService } from './shared/service/configuration.service';
import { ProductsComponent } from './product/products/products.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryReqComponent } from './inventory/inventory-req/inventory-req.component';
import { InventoryDetailsComponent } from './inventory/inventory-details/inventory-details.component';
import { InventoryProcureComponent } from './inventory/inventory-procure/inventory-procure.component';
import { orderBy } from './shared/pipe/order-by.pipe';
import { RolesComponent } from './admin/role/roles/roles.component';
import { RoleDetailsComponent } from './admin/role/role-details/role-details.component';
import { TeamsComponent } from './admin/team/teams/teams.component';
import { TeamDetailsComponent } from './admin/team/team-details/team-details.component';
import { UsersComponent } from './admin/user/users/users.component';
import { UserDetailsComponent } from './admin/user/user-details/user-details.component';
import { SortByPipe, FilterPipe } from './shared/pipe/filter.pipe';
import { ProductSetComponent } from './product/product-set/product-set.component';
import { ProductCategoryComponent } from './product/product-category/product-category.component';
import { AgDropdownGenEditorComponent } from './shared/component/ag-dropdown-gen-editor/ag-dropdown-gen-editor.component';
import { AgDateGenEditorComponent } from './shared/component/ag-date-gen-editor/ag-date-gen-editor.component';
import { MissionsComponent } from './mission/missions/missions.component';
import { MissionDetailsComponent } from './mission/mission-details/mission-details.component';
import { BoxComponent } from './dispatch/box/box.component';
import { BoxDetailsComponent } from './dispatch/box-details/box-details.component';
import { PalletComponent } from './dispatch/pallet/pallet.component';
import { PalletDetailsComponent } from './dispatch/pallet-details/pallet-details.component';
import { CaseComponent } from './product/case/case.component';
import { CaseDetailsComponent } from './product/case-details/case-details.component';
import { OrderComponent } from './inventory/order/order.component';
import { OrderDetailsComponent } from './inventory/order-details/order-details.component';
import { SetModalComponent } from './product/set-modal/set-modal.component';
import { SetDetailsComponent } from './product/set-details/set-details.component';
import { CategoryComponent } from './product/category/category.component';
import { CategoryModalComponent } from './product/category-modal/category-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AutofocusDirective,
    DatepickerDirective,
    SelectDirective,
    TabsetDirective,
    ToggleDirective,
    EqualValidatorDirective,
    LastElementDirective,
    GroupByPipe,
    NotFoundComponent,
    ProductsComponent,
    ProductDetailsComponent,
    InventoryComponent,
    InventoryReqComponent,
    InventoryDetailsComponent,
    InventoryProcureComponent,
    orderBy,
    SortByPipe,
    FilterPipe,
    RolesComponent,
    RoleDetailsComponent,
    TeamsComponent,
    TeamDetailsComponent,
    UsersComponent,
    UserDetailsComponent,
    ProductSetComponent,
    ProductCategoryComponent,
    AgDropdownGenEditorComponent,
    AgDateGenEditorComponent,
    MissionsComponent,
    MissionDetailsComponent,
    BoxComponent,
    BoxDetailsComponent,
    PalletComponent,
    PalletDetailsComponent,
    CaseComponent,
    CaseDetailsComponent,
    OrderComponent,
    OrderDetailsComponent,
    SetModalComponent,
    SetDetailsComponent,
    CategoryComponent,
    CategoryModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    Ng2TableModule,
    LightboxModule,
    ToastyModule.forRoot(),
    PopoverModule.forRoot(),
    PaginationModule.forRoot(),
    AgGridModule.withComponents([]),
    ModalModule.forRoot(),
    DatepickerModule.forRoot(),
  ],
  providers: [
    AlertService,
    ConfigurationService
  ],
  entryComponents: [ProductCategoryComponent, ProductSetComponent, AgDropdownGenEditorComponent, AgDateGenEditorComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
