package camp.mage.server.game;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import camp.mage.server.Event;
import camp.mage.server.Manager;
import camp.mage.server.game.events.PlayerInfo;
import camp.mage.server.game.events.PlayerJoinEvent;
import camp.mage.server.game.events.PlayerLeaveEvent;
import camp.mage.server.game.events.WelcomeEvent;
import camp.mage.server.game.models.Game;
import camp.mage.server.game.models.HallOfFameEntry;
import camp.mage.server.game.models.Player;

/**
 * Created by jacob on 12/6/17.
 */

public class World {

    private final Manager manager;
    private final Map<String, Player> players;
    private final Map<String, Game> games;
    private final List<HallOfFameEntry> hallOfFame;

    public World(Manager manager) {
        this.manager = manager;
        players = new HashMap<>();
        games = new HashMap<>();
        hallOfFame = new ArrayList<>();
    }

    public void join(Player player) {
        manager.send(player, new WelcomeEvent(new ArrayList<>(players.values()), new ArrayList<>(games.values()), hallOfFame));

        player.setId(String.valueOf(new Random().nextInt()));
        players.put(player.getId(), player);

        manager.broadcast(new PlayerJoinEvent(player), player);
    }

    public void leave(Player player) {
        players.remove(player.getId());
        manager.broadcast(new PlayerLeaveEvent(player), player);
    }

    public void broadcast(Event event, Player from) {
        manager.broadcast(event, from);
    }

    public void send(Player player, Event event) {
        manager.send(player, event);
    }

    public void got(Player player, Event event) {
        if (event instanceof PlayerInfo) {
            // Update player name
            player.setName(((PlayerInfo) event).getPlayer().getName());

            // Send player info to all others after adding id
            ((PlayerInfo) event).getPlayer().setId(player.getId());
            manager.broadcast(event, player);
        }
    }
}
