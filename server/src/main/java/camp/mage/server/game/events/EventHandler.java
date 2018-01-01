package camp.mage.server.game.events;

import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 12/7/17.
 */

public interface EventHandler<T> {
    void event(Player player, T event);
}
