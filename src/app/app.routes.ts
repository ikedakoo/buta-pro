import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { PortalComponent } from './portal/portal';
import { DeliveryPlanningComponent } from './delivery-planning/delivery-planning';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'portal', component: PortalComponent },
  { path: 'delivery-planning', component: DeliveryPlanningComponent }
];
