package camp.mage.server.game.events;

import camp.mage.server.Client;

/**
 * Created by jacob on 12/7/17.
 */

public interface EventHandler<T> {
    void event(Client client, T event);
}
