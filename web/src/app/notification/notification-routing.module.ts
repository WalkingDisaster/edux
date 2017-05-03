import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationComponent } from './notification.component';
import { AuthGuard } from '../common/auth-guard.service';

const notificationRoutes: Routes = [
  { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(notificationRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
export class NotificationRoutingModule { }
