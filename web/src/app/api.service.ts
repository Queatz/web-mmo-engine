import { Injectable } from '@angular/core';

import { ServerService } from './server.service';

@Injectable()
export class ApiService {

  constructor(private server: ServerService) { }

  join(playerId: string) {
    this.server.send({
      event: 'join_player',
      data: {
        playerId: playerId
      }
    });
  }

  leave(playerId: string) {
    this.server.send({
      event: 'leave_player',
        data: {
          playerId: playerId
      }
    });
  }

  start(gameId: string) {
    this.server.send({
      event: 'start_game',
      data: {
        gameId: gameId
      }
    });
  }

  pick(gameId: string, pick: number) {
    this.server.send({
      event: 'set_pick',
      data: {
        gameId: gameId,
        pick: pick
      }
    });
  }

  myName(name: string) {
    this.server.send({
      event: 'player_info',
      data: {
        player: {
          name: name
        }
      }
    });
  }

}
