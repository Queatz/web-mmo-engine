package camp.mage.server.game.events;

import camp.mage.server.Event;
import camp.mage.server.game.models.Game;

/**
 * Created by jacob on 12/7/17.
 */

public class GameState implements Event {

    @Override
    public String event() {
        return "game_state";
    }

    private Game game;

    public GameState(Game game) {
        this.game = game;
    }

    public Game getGame() {
        return game;
    }

    public GameState setGame(Game game) {
        this.game = game;
        return this;
    }
}
