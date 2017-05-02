import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { UtilityService, Debouncable } from '../utility.service';

import { UserChangeEvent, UserChangeType } from '../events/user-change-event';

import { ChatMessageDto } from '../dtos/chat-message-dto';

import { ChatMessage } from '../models/chat-message';
import { ChatUser } from '../models/chat-user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, Debouncable {

  timeoutId: number;
  messages: Array<ChatMessage> = new Array<ChatMessage>();
  chatUsers: Array<ChatUser> = new Array<ChatUser>();

  message: string;

  constructor(
    private chatService: ChatService
    , private userService: UserService
    , private utility: UtilityService
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

  // The user list must be updated somehow
  private handleUserEvent(event: UserChangeEvent): void {
    const theUser = this.chatUsers.find(u => u.userName === event.userName);

    // The user is not on the list, and isn't getting removed.
    // We'll add the user. We don't do this in the switch in case the user is typing.
    if (!theUser && event.type !== UserChangeType.Left) {
      this.chatUsers.push(new ChatUser(event.userName, false));
    }

    switch (event.type) {
      case UserChangeType.Left:
        const index = this.chatUsers.indexOf(theUser);
        if (index > 0) {
          this.chatUsers = this.chatUsers.splice(index, 1);
        }
        break;
      case UserChangeType.Typing:
        theUser.typing = true;
        break;
      case UserChangeType.StoppedTyping:
        theUser.typing = false;
        break;
    }

    this.chatUsers.sort((a, b) => this.utility.sort(a.userName, b.userName));
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
    const ENTER_KEY = 13;
    if (value === ENTER_KEY) {
      this.sendMessage();
      return;
    }
    this.utility.debounce(this).subscribe(() => this.chatService.stopTyping())
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
