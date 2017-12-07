package camp.mage.server.game;

/**
 * Created by jacob on 12/6/17.
 */

public interface Multiplayer {
    void onPlayerJoin(Player player);
    void onPlayerLeave(Player player);
}
