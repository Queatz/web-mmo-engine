import { Component, OnInit } from '@angular/core';

import { ApiService } from './api.service';
import { WorldService } from './world.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  name: string;
  players: any[];
  hallOfFame: any[];

  constructor(private api: ApiService, private world: WorldService) {
    this.players = world.players;
    this.hallOfFame = world.hallOfFame;
  }

  ngOnInit() {
    let n = localStorage.getItem('name');

    if (n) {
      this.name = n;
      this.setName();
    }
  }

  game() {
    return this.world.currentGame();
  }

  gameOf(player: any) {
    return this.world.games.find(g => !g.started && player.id === g.host);
  }

  inGame(game: any) {
    return game && game && !!game.players.find(p => p.id === this.world.myId);
  }

  join(player: any) {
    this.api.join(player.id);
  }

  leave() {
    this.api.leave(this.world.currentGame().host);
    this.world.leave();
  }

  start() {
    this.api.start(this.world.currentGame().id);
  }

  setName() {
    localStorage.setItem('name', this.name);
    this.api.myName(this.name);
  }
}
