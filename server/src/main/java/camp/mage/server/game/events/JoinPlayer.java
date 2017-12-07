package camp.mage.server.game.events;

import camp.mage.server.Event;

/**
 * Created by jacob on 12/7/17.
 */

public class JoinPlayer implements Event {
    @Override
    public String event() {
        return "join_player";
    }

    private String playerId;

    public String getPlayerId() {
        return playerId;
    }

    public JoinPlayer setPlayerId(String playerId) {
        this.playerId = playerId;
        return this;
    }
}
