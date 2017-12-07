package camp.mage.server.game.events;

import camp.mage.server.Event;

/**
 * Created by jacob on 12/7/17.
 */

public class LeavePlayer implements Event {
    @Override
    public String event() {
        return "leave_player";
    }

    private String playerId;

    public String getPlayerId() {
        return playerId;
    }

    public LeavePlayer setPlayerId(String playerId) {
        this.playerId = playerId;
        return this;
    }
}
