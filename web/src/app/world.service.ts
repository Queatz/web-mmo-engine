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
   * @param event The events from the server.
   */
  public event(events: any[]) {
    this.game.handleEvents(events);
  }

  /**
   * Send an event to the server.
   * 
   * @param event The event to send.
   */
  public send(events: any[]): boolean {
    this.server.send(events);

    return true;
  }

}
