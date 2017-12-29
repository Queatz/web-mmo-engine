import { Injectable } from '@angular/core';

@Injectable()
export class WorldService {

  public myId: string;
  public games: any[] = [];
  public players: any[] = [];
  public hallOfFame: any[] = [];

  private game: any = null;

  constructor() { }

  public event(event: any) {
    let p;

    switch (event.event) {
      case 'player_info':
        p = this.find(event.data.player.id);

        if (p) {
          p.name = event.data.player.name;
        }

        break;
      case 'welcome':
        event.data.players.forEach(p => this.players.push(p));
        event.data.hallOfFame.forEach(h => this.hallOfFame.push(h));
        event.data.games.forEach(h => this.games.push(h));
        this.myId = event.data.me;

        break;
      case 'player_join':
        this.players.unshift(event.data.player);

        break;
      case 'player_leave':
        p = this.find(event.data.player.id);

        if (!p) {
          return;
        }

        let i = this.players.indexOf(p);

        if (i === -1) {
          return;
        }

        this.players.splice(i, 1);

        break;
      case 'game_state':
        let g = this.games.find(g => event.data.game.id === g.id);

        if (g) {
          Object.assign(g, event.data.game);
        } else {
          g = event.data.game;
          this.games.unshift(g);
        }

        if (g && (g.ended || g.started)) {
          let r = this.games.find(x => x.host === g.id);

          if (r) {
            this.games.splice(this.games.indexOf(r), 1);
          }
        }

        if (g && g.started) {
          if (g.players.find(p => p.id === this.myId)) {
            this.game = g;
          }
        }

        this.updateGame();

        break;
      case 'new_hof':
        this.hallOfFame.length = 0;
        event.data.hallOfFame.forEach(h => this.hallOfFame.push(h));

        break;
    }
  }

  public updateGame() {
    let g2 = this.currentGame();

    if (g2) {
      if (g2.ended) {
        this.game = null;
      }
    }
  }

  public leave() {
    this.game = null;
  }

  public currentGame() {
    if (this.game) {
      return this.game;
    }

    return this.games.find(g => !g.ended && g.host === this.myId);
  }

  public find(id: string): any {
    return this.players.find(p => p.id === id);
  }

}
