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

  pick(i: number) {
    if (!this.isCardActive(i)) {
      return;
    }

    this.api.pick(this.world.currentGame().id, i);
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

  getPromptText() {
    let g = this.game();

    if (!g) {
      return 'Waiting...';
    }

    if (g.turn.picker === this.world.myId) {
      if (g.turn.pick === undefined) {
        return 'Pick a card!';
      }

      return 'Waiting on others...';
    }

    if (g.turn.pick === undefined) {
      return 'Waiting for ' + this.pickerName(g) + ' to pick';
    }

    if (g.turn.guessers.indexOf(this.world.myId) === -1) {
      return 'Guess what ' + this.pickerName(g) + ' picked!';
    }

    return 'Waiting on others...';
  }

  pickerName(g: any) {
    return g.players.find(p => p.id === g.turn.picker).name;
  }

  isCardActive(i: number) {
    let g = this.game();

    if (!g) {
      return false;
    }

    if (g.turn.picker === this.world.myId) {
      if (g.turn.pick !== undefined) {
        return false;
      }
    } else {
      if (g.turn.pick === undefined) {
        return false;
      }

      if (g.turn.guessers.indexOf(this.world.myId) !== -1) {
        return false;
      }

      if (g.turn.guesses.indexOf(i) !== -1) {
        return false;
      }
    }

    return true;
  }
}
