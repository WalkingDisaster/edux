import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotificationBarModule, NotificationBarService } from 'angular2-notification-bar';

import { AppRoutingModule } from './app-routing.module';
import { ChatRoutingModule } from './chat/chat-routing.module';
import { LoginRoutingModule } from './login/login-routing.module';
import { NotificationRoutingModule } from './notification/notification-routing.module';
import { SupportRequestRoutingModule } from './support-request/support-request-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

import { EventAggregatorService } from './common/event-aggregator.service';
import { SoftLockFieldService } from './common/soft-lock-field.service';
import { SocketService } from './common/socket.service';
import { ChatService } from './chat/chat.service';
import { UserService } from './common/user.service';
import { UtilityService } from './common/utility.service';
import { NotificationService } from './notification/notification.service';
import { SupportRequestService } from './support-request/services/support-request.service';

import { NotificationComponent } from './notification/notification.component';
import { SupportRequestComponent } from './support-request/support-request.component';
import { SupportRequestListComponent } from './support-request/list/support-request-list.component';
import { SupportRequestItemComponent } from './support-request/item/support-request-item.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    ChatComponent,
    LoginComponent,
    NotificationComponent,
    SupportRequestComponent,
    SupportRequestListComponent,
    SupportRequestItemComponent
  ],
  imports: [
    ChatRoutingModule,
    NotificationRoutingModule,
    SupportRequestRoutingModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    NotificationBarModule
  ],
  providers: [
    EventAggregatorService,
    SoftLockFieldService,
    SocketService,
    ChatService,
    UserService,
    UtilityService,
    NotificationService,
    NotificationBarService,
    SupportRequestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
