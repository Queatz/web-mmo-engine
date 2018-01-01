package camp.mage.server.game;

import java.util.Random;

import camp.mage.server.Manager;
import camp.mage.server.game.events.client.ActionClientEvent;
import camp.mage.server.game.events.client.ChatClientEvent;
import camp.mage.server.game.events.client.EditClientEvent;
import camp.mage.server.game.events.client.EditorClientEvent;
import camp.mage.server.game.events.client.IdentifyClientEvent;
import camp.mage.server.game.events.client.InventoryClientEvent;
import camp.mage.server.game.events.client.MoveClientEvent;
import camp.mage.server.game.events.client.RegisterClientEvent;
import camp.mage.server.game.events.server.BasicErrorServerEvent;
import camp.mage.server.game.events.server.StateServerEvent;
import camp.mage.server.game.map.MapPos;
import camp.mage.server.game.map.MapTile;
import camp.mage.server.game.map.ObjectMap;
import camp.mage.server.game.map.TilePos;
import camp.mage.server.game.objs.MapObject;
import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 12/6/17.
 */

public class World {

    private final Manager manager;
    private final ObjectMap objs;
    private final MapObject startingMap;

    public World(Manager manager) {
        this.manager = manager;
        objs = new ObjectMap();
        startingMap = new MapObject(this);

        this.manager.events.register("identify", (Player player, IdentifyClientEvent event) -> {
            if (event.token != null) {
                welcome(player);
                return;
            }

            if (event.username == null || event.password == null) {
                welcome(player);
                return;
            }

            this.send(player, new BasicErrorServerEvent("Missing token, or username / password"));
        });

        this.manager.events.register("register", (Player player, RegisterClientEvent event) -> {
            // Set username/pass
        });

        this.manager.events.register("editor", (Player player, EditorClientEvent event) -> {
            // Send invisible objects
        });

        this.manager.events.register("chat", (Player player, ChatClientEvent event) -> {
            // Send chat to map or world
        });

        this.manager.events.register("move", (Player player, MoveClientEvent event) -> {
            player.getMap().move(player, new MapPos(event.pos));
        });

        this.manager.events.register("action", (Player player, ActionClientEvent event) -> {

        });

        this.manager.events.register("inventory", (Player player, InventoryClientEvent event) -> {

        });

        this.manager.events.register("edit", (Player player, EditClientEvent event) -> {
            if (event.addObj != null) {

            }

            if (event.removeObj != null) {

            }

            if (event.moveObj != null) {

            }

            if (event.tile != null) {
                player.getMap().setTileAt(
                        new TilePos(event.tile),
                        new MapTile(event.tile.get(2), event.tile.get(3))
                );
            }
        });
    }

    public void join(Player player) {
        objs.add(player);
    }

    public void leave(Player player) {
        objs.remove(player.getId());
    }

    public void send(Player player, Object event) {
        manager.send(player, event);
    }

    private void welcome(Player player) {
        if (player.getId() == null) {
            player.setId(rndId());
        }

        if (player.getMap() == null) {
            player.setMap(startingMap);
        }

        manager.send(player, new StateServerEvent()
                .map(player.getMap())
                .you(player));
    }

    private String rndId() {
        return String.valueOf(new Random().nextInt());
    }
}
