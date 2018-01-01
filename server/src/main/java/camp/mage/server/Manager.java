package camp.mage.server;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonSyntaxException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import camp.mage.server.game.World;
import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 12/6/17.
 */

public class Manager implements MultiplayerServer {

    private GameServer server;
    private World world;
    public final Events events;
    private Gson gson;
    private GameLoop loop;

    private Map<Player, Client> clientFromPlayer = new HashMap<>();

    public Manager(GameServer server) {
        this.server = server;
        this.events = new Events();
        this.world = new World(this);
        this.gson = new Gson();
        this.loop = new GameLoop(this.world);
        this.loop.start();
    }

    public World getWorld() {
        return world;
    }

    public void broadcast(Object event, Player fromPlayer) {
        // XXX TODO Accumulate all events per frame and send to clients
        List<Object> allEvents = new ArrayList<>();
        allEvents.add(events.translateServerEvent(gson, event));

        server.broadcast(
                fromPlayer != null ? clientFromPlayer.get(fromPlayer) : null,
                gson.toJson(allEvents)
        );
    }

    public void send(Player player, Object event) {
        if (!clientFromPlayer.containsKey(player)) {
            return;
        }

        // XXX TODO Accumulate all events per frame and send to clients
        List<Object> allEvents = new ArrayList<>();
        allEvents.add(events.translateServerEvent(gson, event));

        server.send(clientFromPlayer.get(player), gson.toJson(allEvents));
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
        try {
            JsonArray allEvents = gson.fromJson(message, JsonArray.class);

            for (JsonElement event : allEvents) {
                events.translateClientEvent(gson, client.getPlayer(), event.getAsJsonArray());
            }
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
        }
    }
}
