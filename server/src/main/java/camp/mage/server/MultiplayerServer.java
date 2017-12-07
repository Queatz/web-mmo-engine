package camp.mage.server;

/**
 * Created by jacob on 12/6/17.
 */

public interface MultiplayerServer {
    void onPlayerJoin(Client client);
    void onPlayerLeave(Client client);
    void onPlayerMessage(Client client, String message);
}
