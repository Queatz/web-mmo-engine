package camp.mage.server.game.events;

import camp.mage.server.Event;
import camp.mage.server.game.models.Player;

/**
 * Created by jacob on 12/7/17.
 */

public class PlayerJoin implements Event {

    @Override
    public String event() {
        return "player_join";
    }

    private Player player;

    public PlayerJoin(Player player) {
        this.player = player;
    }
}
