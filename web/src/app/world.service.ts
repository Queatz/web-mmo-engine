import { Game } from '../game/game';
import { ServerService } from './server.service';

/**
 * Handles raw WebSocket server and game interaction.
 */
export class WorldService {

  // Injections
  server: ServerService;
  game: Game;

  constructor() { }

  /**
   * Called on events from server.
   * 
   * @param event 
   */
  public event(event: any) {
    this.game.world.event(event);
  }

  /**
   * Send an event to the server.
   * 
   * @param event The event to send.
   */
  public send(event: any) {
    this.server.send(event);
  }

}
