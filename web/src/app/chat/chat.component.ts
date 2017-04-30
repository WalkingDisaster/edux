import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ChatService } from '../chat.service';
import { UserService } from '../user.service';

import { UserChangeEvent, UserChangeType } from '../events/user-change-event';

import { ChatMessageDto } from '../dtos/chat-message-dto';

import { ChatMessage } from '../models/chat-message';
import { ChatUser } from '../models/chat-user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: Array<ChatMessage> = new Array<ChatMessage>();
  users: Set<string>; // delete
  typingUsers: Set<string> = new Set<string>(); // delete
  chatUsers: Array<ChatUser> = new Array<ChatUser>();

  constructor(
    private chatService: ChatService
    , private userService: UserService
  ) { }

  ngOnInit() {
    this.chatService.userSubject.subscribe(
      user => this.handleUserEvent(user),
      user => this.handleUserChangeError(user),
      () => this.noMoreUsers());
    this.chatService.messageSubject.subscribe(
      message => this.handleMessage(message),
      message => this.handleMessageError(message),
      () => this.noMoreMessages());

    this.users = new Set(this.chatService.users); // delete
    this.chatUsers = Array.from(this.chatService.users, u => new ChatUser(u, false));
    this.chatService.connectAs(this.userService.getUserName());
  }

  private handleUserEvent(event: UserChangeEvent): void {
    switch (event.type) {
      case UserChangeType.Joined:
        this.users.add(event.userName); // delete
        this.chatUsers.push(new ChatUser(event.userName, false));
        break;
      case UserChangeType.Left:
        this.users.delete(event.userName); // delete
        const toRemove = this.chatUsers.find(u => u.userName === event.userName);
        const index = this.chatUsers.indexOf(toRemove);
        if (index > 0) {
          this.chatUsers = this.chatUsers.splice(index, 1);
        }
        break;
      case UserChangeType.Typing:
        if (this.typingUsers.has(event.userName)) { // delete
          this.typingUsers.delete(event.userName); // delete
        } // delete
        const userWhoIsTyping = this.chatUsers.find(u => u.userName === event.userName);
        if (userWhoIsTyping) {
          userWhoIsTyping.typing = true;
        }
        break;
      case UserChangeType.StoppedTyping:
        if (!this.typingUsers.has(event.userName)) { // delete
          this.typingUsers.add(event.userName); // delete
        } // delete
        const userWhoIsNotTyping = this.chatUsers.find(u => u.userName === event.userName);
        if (userWhoIsNotTyping) {
          userWhoIsNotTyping.typing = false;
        }
        break;
    }
  }

  private handleUserChangeError(error): void {
    this.users.clear(); // delete
    this.users.add('error'); // delete
    this.chatUsers = [new ChatUser('error', false)];
  }
  private noMoreUsers(): void {
    console.log('Service ended user stream.');
  }

  private handleMessage(message: ChatMessageDto): void {
    this.messages.push(new ChatMessage(message.userName, message.message));
  }
  private handleMessageError(error): void {
    this.messages.push(new ChatMessage('error', 'error'));
  }
  private noMoreMessages(): void {
    console.log('Service ended message stream.');
  }
}
