package camp.mage.server.game.events;

import camp.mage.server.Event;
import camp.mage.server.game.models.Player;

/**
 * Created by jacob on 12/7/17.
 */

public class PlayerLeave implements Event {

    @Override
    public String event() {
        return "player_leave";
    }

    private Player player;

    public PlayerLeave(Player player) {
        this.player = player;
    }
}
