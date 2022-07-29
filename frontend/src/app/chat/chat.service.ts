import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket = io(BACKEND_URL, { transports: ['websocket'] });
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private authService: AuthService) { }

  public sendMessage(message: string) {
    this.socket.emit('sendNewMessage', {
      userId: this.authService.getUserId,
      message: message
    });
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}
