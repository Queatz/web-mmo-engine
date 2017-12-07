package camp.mage.server.game.events;

import camp.mage.server.Event;
import camp.mage.server.game.models.Player;

/**
 * Created by jacob on 12/7/17.
 */

public class PlayerInfo implements Event {

    @Override
    public String event() {
        return "player_info";
    }

    private Player player;

    public PlayerInfo(Player player) {
        this.player = player;
    }

    public Player getPlayer() {
        return player;
    }

    public PlayerInfo setPlayer(Player player) {
        this.player = player;
        return this;
    }
}
