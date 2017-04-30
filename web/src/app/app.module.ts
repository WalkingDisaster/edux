import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { ChatRoutingModule } from './chat/chat-routing.module';
import { LoginRoutingModule } from './login/login-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HelloComponent } from './hello/hello.component';
import { ChatComponent } from './chat/chat.component';

import { ChatService } from './chat.service';
import { UserService } from './user.service';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HelloComponent,
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
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
