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

  private timeoutId: number;

  messages: Array<ChatMessage> = new Array<ChatMessage>();
  chatUsers: Array<ChatUser> = new Array<ChatUser>();

  message: string;

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

    this.chatUsers = Array.from(this.chatService.users, u => new ChatUser(u, false));
    this.chatService.connectAs(this.userService.getUserName());
  }

  private handleUserEvent(event: UserChangeEvent): void {
    switch (event.type) {
      case UserChangeType.Joined:
        this.chatUsers.push(new ChatUser(event.userName, false));
        break;
      case UserChangeType.Left:
        const toRemove = this.chatUsers.find(u => u.userName === event.userName);
        const index = this.chatUsers.indexOf(toRemove);
        if (index > 0) {
          this.chatUsers = this.chatUsers.splice(index, 1);
        }
        break;
      case UserChangeType.Typing:
        const userWhoIsTyping = this.chatUsers.find(u => u.userName === event.userName);
        if (userWhoIsTyping) {
          userWhoIsTyping.typing = true;
        }
        break;
      case UserChangeType.StoppedTyping:
        const userWhoIsNotTyping = this.chatUsers.find(u => u.userName === event.userName);
        if (userWhoIsNotTyping) {
          userWhoIsNotTyping.typing = false;
        }
        break;
    }
  }

  private handleUserChangeError(error): void {
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

  public keyPressed(value: number): void {
    if (value === 13) {
      this.sendMessage();
      return;
    }
    // logic to capture typing
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.chatService.stopTyping();
    }, 500);
    this.chatService.typing();
  }

  public sendMessage(): void {
    if (!this.message || this.message.trim() === '') {
      return;
    }
    this.chatService.sendMessage(this.message);
    this.message = '';
  }
}
