import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { ChatRoutingModule } from './chat/chat-routing.module';
import { LoginRoutingModule } from './login/login-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

import { ChatService } from './chat.service';
import { UserService } from './user.service';
import { UtilityService } from './utility.service';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    ChatComponent,
    LoginComponent
  ],
  imports: [
    ChatRoutingModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    ChatService,
    UserService,
    UtilityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
