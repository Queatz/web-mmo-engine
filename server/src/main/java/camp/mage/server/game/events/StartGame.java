package camp.mage.server.game.events;

import camp.mage.server.Event;

/**
 * Created by jacob on 12/7/17.
 */

public class StartGame implements Event {
    @Override
    public String event() {
        return "start_game";
    }

    private String gameId;

    public String getGameId() {
        return gameId;
    }

    public StartGame setGameId(String gameId) {
        this.gameId = gameId;
        return this;
    }
}
