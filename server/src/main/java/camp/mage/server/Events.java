package camp.mage.server;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

import java.util.HashMap;
import java.util.Map;

import camp.mage.server.game.events.EventHandler;
import camp.mage.server.game.events.client.ActionClientEvent;
import camp.mage.server.game.events.client.ChatClientEvent;
import camp.mage.server.game.events.client.EditClientEvent;
import camp.mage.server.game.events.client.EditorClientEvent;
import camp.mage.server.game.events.client.IdentifyClientEvent;
import camp.mage.server.game.events.client.InventoryClientEvent;
import camp.mage.server.game.events.client.MoveClientEvent;
import camp.mage.server.game.events.client.RegisterClientEvent;
import camp.mage.server.game.events.server.BasicErrorServerEvent;
import camp.mage.server.game.events.server.ChatServerEvent;
import camp.mage.server.game.events.server.InventoryServerEvent;
import camp.mage.server.game.events.server.MapServerEvent;
import camp.mage.server.game.events.server.ObjServerEvent;
import camp.mage.server.game.events.server.StateServerEvent;
import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 12/7/17.
 */

public class Events {

    private final Map<String, EventHandler<?>> clientEvents = new HashMap<>();
    private final Map<String, Class> clientEventTypes = new HashMap<>();
    private final Map<Class, String> serverEvents = new HashMap<>();

    public Events() {
        serverEvents.put(BasicErrorServerEvent.class,   "error");
        serverEvents.put(ChatServerEvent.class,         "chat");
        serverEvents.put(InventoryServerEvent.class,    "inventory");
        serverEvents.put(MapServerEvent.class,          "map");
        serverEvents.put(ObjServerEvent.class,          "obj");
        serverEvents.put(StateServerEvent.class,        "state");

        clientEventTypes.put("identify", IdentifyClientEvent.class);
        clientEventTypes.put("register", RegisterClientEvent.class);
        clientEventTypes.put("editor", EditorClientEvent.class);
        clientEventTypes.put("chat", ChatClientEvent.class);
        clientEventTypes.put("move", MoveClientEvent.class);
        clientEventTypes.put("action", ActionClientEvent.class);
        clientEventTypes.put("inventory", InventoryClientEvent.class);
        clientEventTypes.put("edit", EditClientEvent.class);
    }

    public <T> void register(String action, EventHandler<T> handler) {
        if (clientEvents.containsKey(action)) {
            return;
        }

        clientEvents.put(action, handler);
    }

    public <T> void unregister(String action, EventHandler<T> handler) {
        if (!clientEvents.containsKey(action) || clientEvents.get(action) != handler) {
            return;
        }

        clientEvents.remove(action);
    }

    public void translateClientEvent(Gson gson, Player player, JsonArray eventJson) {
        if (eventJson.size() < 2) {
            return;
        }

        String eventAction = eventJson.get(0).getAsString();
        JsonElement eventData = eventJson.get(1);

        if (!clientEvents.containsKey(eventAction)) {
            return;
        }

        if (!clientEventTypes.containsKey(eventAction)) {
            throw new RuntimeException("Cannot handle event: " + eventAction);
        }

        clientEvents.get(eventAction).event(
                player,
                gson.fromJson(eventData, TypeToken.get(clientEventTypes.get(eventAction)).getType())
        );
    }

    public JsonElement translateServerEvent(Gson gson, Object event) {
        if (!this.serverEvents.containsKey(event.getClass())) {
            throw new RuntimeException("Unhandleable event: " + event.getClass());
        }

        JsonArray jsonArray = new JsonArray();
        jsonArray.add(this.serverEvents.get(event.getClass()));
        jsonArray.add(gson.toJsonTree(event));

        return jsonArray;
    }
}
