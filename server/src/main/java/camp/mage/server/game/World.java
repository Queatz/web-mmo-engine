package camp.mage.server.game;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import camp.mage.server.Client;
import camp.mage.server.Manager;
import camp.mage.server.Objects;
import camp.mage.server.game.accounts.Accounts;
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
import camp.mage.server.game.objs.BaseObject;
import camp.mage.server.game.objs.MapObject;
import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 12/6/17.
 */

public class World {

    private final Manager manager;
    private final ObjectMap objs;
    private final MapObject startingMap;
    private final Accounts accounts;

    private final Map<Client, Player> clients = new HashMap<>();

    public World(Manager manager) {
        this.manager = manager;
        objs = new ObjectMap();
        accounts = new Accounts(this);
        startingMap = new MapObject(this);

        this.manager.events.register("identify", (Client client, IdentifyClientEvent event) -> {
            if (event.token != null) {
                Player player = accounts.getPlayerFromToken(event.token);

                if (player == null) {
                    player = new Player(this);
                    player.setId(rndId());

                    accounts.setPlayerForToken(event.token, player);
                } else {
                    // Close other connections to this player
                    if (player.getClient() != null) {
                        player.getClient().close();
                    }
                }

                // TODO Remember which map...
                player.setMap(startingMap);
                player.setClient(client);
                clients.put(client, player);

                welcome(player);
                return;
            }

            if (event.username == null || event.password == null) {
                Player player = accounts.getPlayerFromLogin(event.username, event.password);

                // TODO Remember which map...
                player.setMap(startingMap);

                player.setClient(client);

                if (player != null) {
                    welcome(player);
                } else {
                    manager.send(client, new BasicErrorServerEvent("Account not found"));
                }

                return;
            }

            this.manager.send(client, new BasicErrorServerEvent("Missing token, or username / password"));
        });

        this.manager.events.register("register", (Client client, RegisterClientEvent event) -> {
            // Set username/pass
        });

        this.manager.events.register("editor", (Client client, EditorClientEvent event) -> {
            // Send invisible objects
        });

        this.manager.events.register("chat", (Client client, ChatClientEvent event) -> {
            // Send chat to map or world
        });

        this.manager.events.register("move", (Client client, MoveClientEvent event) -> {
            Player player = clients.getOrDefault(client, null);

            if (player == null) {
                return;
            }

            player.getMap().move(player, new MapPos(event.pos));
        });

        this.manager.events.register("action", (Client client, ActionClientEvent event) -> {

        });

        this.manager.events.register("inventory", (Client client, InventoryClientEvent event) -> {

        });

        this.manager.events.register("edit", (Client client, EditClientEvent event) -> {
            Player player = clients.getOrDefault(client, null);

            if (player == null) {
                return;
            }

            if (event.addObj != null) {
                BaseObject obj = Objects.createFromType(this, event.addObj.type);
                obj.setId(rndId());
                obj.getPos().x = event.addObj.pos.get(0);
                obj.getPos().y = event.addObj.pos.get(1);

                // Add to map
                obj.setMap(player.getMap());

                // Add to world
                objs.add(obj);
            }

            if (event.removeObj != null) {

            }

            if (event.moveObj != null) {
                BaseObject obj = objs.get(event.moveObj.id);

                if (obj != null) {
                    obj.getPos().set(new MapPos(event.moveObj.pos.get(0), event.moveObj.pos.get(1)));
                }
            }

            if (event.tile != null) {
                player.getMap().setTileAt(
                        new TilePos(event.tile),
                        new MapTile(event.tile.get(2), event.tile.get(3))
                );
            }
        });
    }

    public void join(BaseObject obj) {
        objs.add(obj);
    }

    public void leave(BaseObject obj) {
        objs.remove(obj.getId());
        obj.setMap(null);
    }

    public void send(Player player, Object event) {
        if (player.getClient() == null) {
            return;
        }

        manager.send(player.getClient(), event);
    }

    public void update() {
        this.objs.all().forEach(o -> o.update());
    }

    public void connect(Client client) {
        // See "identify" event
    }

    public void disconnect(Client client) {
        Player player = clients.getOrDefault(client, null);

        if (player != null) {
            leave(player);
            player.setClient(null);
            clients.remove(client);
        }
    }

    private void welcome(Player player) {
        join(player);

        manager.send(player.getClient(), new StateServerEvent()
                .map(player.getMap())
                .you(player));
    }

    private String rndId() {
        return Long.toHexString(new Random().nextLong());
    }
}
