package camp.mage.server;

import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

import camp.mage.server.game.World;
import camp.mage.server.game.models.Player;

/**
 * Created by jacob on 12/6/17.
 */

public class Manager implements MultiplayerServer {

    private GameServer server;
    private World world;
    private Gson gson;

    private Map<Player, Client> clientFromPlayer = new HashMap<>();

    public Manager(GameServer server) {
        this.server = server;
        this.world = new World(this);
        this.gson = new Gson();
    }

    public void broadcast(Event event, Player fromPlayer) {
        server.broadcast(
                fromPlayer != null ? clientFromPlayer.get(fromPlayer) : null,
                gson.toJson(new EventJson(event))
        );
    }

    public void send(Player player, Event event) {
        server.send(clientFromPlayer.get(player), gson.toJson(new EventJson(event)));
    }

    @Override
    public void onPlayerJoin(Client client) {
        clientFromPlayer.put(client.getPlayer(), client);
        world.join(client.getPlayer());
    }

    @Override
    public void onPlayerLeave(Client client) {
        world.leave(client.getPlayer());
        clientFromPlayer.remove(client.getPlayer());
    }

    @Override
    public void onPlayerMessage(Client client, String message) {
        world.got(client.getPlayer(), Events.translate(gson, gson.fromJson(message, EventJson.class)));
    }
}
