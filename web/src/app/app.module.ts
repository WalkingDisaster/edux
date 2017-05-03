import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NotificationBarModule, NotificationBarService } from 'angular2-notification-bar';

import { AppRoutingModule } from './app-routing.module';
import { ChatRoutingModule } from './chat/chat-routing.module';
import { LoginRoutingModule } from './login/login-routing.module';
import { NotificationRoutingModule } from './notification/notification-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

import { SocketService } from './common/socket.service';
import { ChatService } from './chat/chat.service';
import { UserService } from './common/user.service';
import { UtilityService } from './common/utility.service';
import { NotificationService } from './notification/notification.service';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    ChatComponent,
    LoginComponent,
    NotificationComponent
  ],
  imports: [
    ChatRoutingModule,
    NotificationRoutingModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    NotificationBarModule
  ],
  providers: [
    SocketService,
    ChatService,
    UserService,
    UtilityService,
    NotificationService,
    NotificationBarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
