import { Routes } from '@angular/router';
import { HomeComponent } from './components/modules/home-module/home/home.component';
import { LoginComponent } from './components/modules/login-module/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ConfigurationComponent } from './components/modules/configuration-module/configuration/configuration.component';
import { ProductComponent } from './components/modules/product-module/product/product.component';
import { OrderComponent } from './components/modules/order-module/order/order.component';
import { ReportComponent } from './components/modules/report-module/report/report.component';
import { NewCategoryComponent } from './components/modules/configuration-module/category/new-category/new-category.component';
import { ListCategoryComponent } from './components/modules/configuration-module/category/list-category/list-category.component';
import { NewProviderComponent } from './components/modules/configuration-module/provider/new-provider/new-provider.component';
import { ListProviderComponent } from './components/modules/configuration-module/provider/list-provider/list-provider.component';
import { ListUserComponent } from './components/modules/configuration-module/user/list-user/list-user.component';
import { NewUserComponent } from './components/modules/configuration-module/user/new-user/new-user.component';
import { ProductFormComponent } from './components/modules/product-module/product-actions/product-form/product-form.component';
import { OrderFormComponent } from './components/modules/order-module/order-actions/order-form/order-form.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-product/:create',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'info-product/:see/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-product/:edit/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-order/:create',
    component: OrderFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'info-order/:see/:id',
    component: OrderFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-order/:edit/:id',
    component: OrderFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'complete-order/:fill/:id',
    component: OrderFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'report',
    component: ReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category',
    component: ListCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-category',
    component: NewCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'provider',
    component: ListProviderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-provider/:create',
    component: NewProviderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'info-provider/:see/:id',
    component: NewProviderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-provider/:edit/:id',
    component: NewProviderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    component: ListUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-user/:create',
    component: NewUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'info-user/:see/:id',
    component: NewUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-user/:edit/:id',
    component: NewUserComponent,
    canActivate: [AuthGuard],
  },
];
