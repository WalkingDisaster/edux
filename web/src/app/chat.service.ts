import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { UserDto } from './dtos/user-dto';
import { ChatMessageDto } from './dtos/chat-message-dto';

import { UserChangeEvent, UserChangeType } from './events/user-change-event';
import { MessageEvent } from './events/message-event';

import { SocketService } from './socket.service';
import { UserService } from './user.service';

import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

    private joined = false;
    private isTyping = false;
    private socket: SocketIOClient.Socket;
    private currentUser: string;

    userSubject: Subject<UserChangeEvent>;
    users: Set<string>;

    messageSubject: Subject<MessageEvent>;

    constructor(private userService: UserService, private socketService: SocketService) {
        this.users = new Set<string>();
        this.userSubject = new Subject<UserChangeEvent>();
        this.messageSubject = new Subject<MessageEvent>();

        this.initSocket(this.socketService.connect('chat'));
        // this.userService.logoutSubject.subscribe(() => this.socket.disconnect());
    }

    private initSocket(socket: SocketIOClient.Socket): void {
        this.subscribeEvents(socket);
        this.socket = socket;
    }
    private subscribeEvents(socket: SocketIOClient.Socket): void {
        socket
            .on('robot roll call', users => this.replaceUsers(users))
            .on('user joined', user => this.addUser(user))
            .on('user left', user => this.removeUser(user))
            .on('new message', message => this.messageReceived(message))
            .on('typing', user => this.userIsTyping(user))
            .on('stop typing', user => this.userStoppedTyping(user))
            .on('disconnect', () => this.onDisconnected())
            .on('connect', () => this.onReconnected());
    }

    private replaceUsers(data: any): void {
        const currentUsers = Array.from(this.users);
        for (let i = 0; i < currentUsers.length; i++) {
            const currentUser = currentUsers[i];
            this.removeUser(new UserDto(currentUser));
        }

        for (const user of data.users) {
            this.addUser(new UserDto(user));
        }
        console.log(this.users);
    }

    private addUser(userDto: UserDto): void {
        if (this.users.has(userDto.userName)) {
            return;
        }
        this.users.add(userDto.userName);
        this.userSubject.next(new UserChangeEvent(userDto.userName, UserChangeType.Joined));
    }

    private removeUser(userDto: UserDto): void {
        if (this.users.has(userDto.userName)) {
            this.users.delete(userDto.userName);
            this.userSubject.next(new UserChangeEvent(userDto.userName, UserChangeType.Left));
        }
    }

    private messageReceived(messageDto: ChatMessageDto): void {
        this.messageSubject.next(new MessageEvent(messageDto.userName, messageDto.message));
    }

    private userIsTyping(user: UserDto): void {
        this.userSubject.next(new UserChangeEvent(user.userName, UserChangeType.Typing));
    }

    private userStoppedTyping(user: UserDto): void {
        this.userSubject.next(new UserChangeEvent(user.userName, UserChangeType.StoppedTyping));
    }

    private onDisconnected(): void {
    }

    private onReconnected(): void {
        this.join();
    }

    private join(): void {
        this.socket.emit('join', this.currentUser);
        this.joined = true;
    }

    public joinAs(userName: string): void {
        if (this.currentUser !== userName) {
            this.currentUser = userName;
        }
        this.join();
    }

    public leave(): void {
        this.socket.emit('leave');
        this.joined = false;
    }

    public sendMessage(message: string): void {
        this.messageSubject.next(new MessageEvent(this.currentUser, message));
        this.socket.emit('new message', message);
    }

    public typing(): void {
        if (!this.isTyping) {
            this.isTyping = true;
            this.socket.emit('typing');
        }
    }

    public stopTyping(): void {
        if (this.isTyping) {
            this.isTyping = false;
            this.socket.emit('stop typing');
        }
    }
}