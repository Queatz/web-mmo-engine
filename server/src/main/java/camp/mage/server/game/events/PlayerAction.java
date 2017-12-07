package camp.mage.server.game.events;

import camp.mage.server.Event;

/**
 * Created by jacob on 12/7/17.
 */

public class PlayerAction implements Event {

    @Override
    public String event() {
        return "player_action";
    }

    private String action;
    private String value;
}
