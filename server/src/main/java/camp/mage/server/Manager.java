package camp.mage.server;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonSyntaxException;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jacob on 12/6/17.
 */

public class Manager implements MultiplayerServer {

    private GameServer server;
    public final Events events;
    private Gson gson;
    private GameLoop loop;

    public Manager(GameServer server) {
        this.server = server;
        this.events = new Events();
        this.gson = new Gson();
        this.loop = new GameLoop(this);
        this.loop.start();
    }

    public void broadcast(Object event, Client fromClient) {
        // XXX TODO Accumulate all events per frame and send to clients
        List<Object> allEvents = new ArrayList<>();
        allEvents.add(events.translateServerEvent(gson, event));

        server.broadcast(fromClient, gson.toJson(allEvents));
    }

    public void send(Client client, Object event) {
        // XXX TODO Accumulate all events per frame and send to clients
        List<Object> allEvents = new ArrayList<>();
        allEvents.add(events.translateServerEvent(gson, event));

        server.send(client, gson.toJson(allEvents));
    }

    @Override
    public void onPlayerJoin(Client client) {
        loop.connect(client);
    }

    @Override
    public void onPlayerLeave(Client client) {
        loop.disconnect(client);
    }

    @Override
    public void onPlayerMessage(Client client, String message) {
        try {
            JsonArray allEvents = gson.fromJson(message, JsonArray.class);

            for (JsonElement event : allEvents) {
                events.translateClientEvent(gson, client, event.getAsJsonArray());
            }
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
        }
    }

    void stop() {
        loop.die();

        try {
            loop.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
