package camp.mage.server.game.events;

import camp.mage.server.Event;
import camp.mage.server.game.models.Player;

/**
 * Created by jacob on 12/7/17.
 */

public class PlayerJoinEvent implements Event {

    @Override
    public String event() {
        return "player_join";
    }

    private Player player;

    public PlayerJoinEvent(Player player) {
        this.player = player;
    }
}
