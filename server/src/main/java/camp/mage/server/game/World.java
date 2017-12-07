package camp.mage.server.game;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import camp.mage.server.Event;
import camp.mage.server.Manager;
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
        player.setId(String.valueOf(new Random().nextInt()));
        players.put(player.getId(), player);

        manager.broadcast(new PlayerJoinEvent(player), player);
        manager.send(player, new WelcomeEvent(new ArrayList<>(games.values()), hallOfFame));
    }

    public void leave(Player player) {
        players.remove(player.getId());
        manager.broadcast(new PlayerLeaveEvent(player), player);
    }

    public void broadcast(Event message, Player from) {
        manager.broadcast(message, from);
    }

    public void send(Player player, Event message) {
        manager.send(player, message);
    }

    public void got(Player player, Event message) {
//        player.got();
    }
}
