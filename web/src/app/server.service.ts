import { Injectable } from '@angular/core';

import { WorldService } from './world.service';

@Injectable()
export class ServerService {

  private ws: WebSocket;
  public state: string;

  private pending: any[] = [];

  constructor(private world: WorldService) {
     this.reconnect();
  }

  public reconnect() {
    this.ws = new WebSocket('ws://localhost:8080/server/ws');

    this.ws.onmessage = message => this.onMessage(message.data);
    this.ws.onopen = () => this.onOpen();
    this.ws.onclose = () => this.onClose();

    this.state = 'connecting';
  }

  public send(message: any) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      console.log('pending', message);
      this.pending.push(message);
      return;
    }

    this.ws.send(JSON.stringify(message));
    console.log('send', message);
  }

  private onClose() {
    this.state = 'disconnected';
    console.log('closed');
  }

  private onOpen() {
    this.state = 'connected';
    console.log('opened');

    while(this.pending.length) {
      this.send(this.pending.shift());
    }
  }

  private onMessage(message: string) {
    this.world.event(JSON.parse(message));
    console.log('got', JSON.parse(message));
  }

}
