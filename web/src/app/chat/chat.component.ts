import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ChatService } from '../chat.service';
import { UserService } from '../user.service';

import { ChatMessage } from '../models/chat-message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  funk = 'loadin';
  messages: Array<ChatMessage> = new Array<ChatMessage>();
  users: Array<string> = new Array<string>();

  constructor(
    private chatService: ChatService
    , private userService: UserService
  ) { }

  ngOnInit() {
    this.funk = this.chatService.getFunk();
    this.chatService.iAm(this.userService.getUserName()).subscribe(
      value => value.forEach(v => this.users.push(v)),
      error => {
        while (this.users.length > 0) {
          this.users.pop();
        }
        this.users.push('Error!');
      },
      () => { }
    );

    this.chatService.getMessageObserver().subscribe(
      value => this.messages.push(value),
      error => this.messages.push(new ChatMessage('error', 'error')),
      () => this.messages.push(new ChatMessage('fin', 'fin'))
    );
  }
}
