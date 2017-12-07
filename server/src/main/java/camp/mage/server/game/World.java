package camp.mage.server.game;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import camp.mage.server.Event;
import camp.mage.server.Manager;
import camp.mage.server.game.events.BasicError;
import camp.mage.server.game.events.GameState;
import camp.mage.server.game.events.JoinPlayer;
import camp.mage.server.game.events.PlayerInfo;
import camp.mage.server.game.events.PlayerJoin;
import camp.mage.server.game.events.PlayerLeave;
import camp.mage.server.game.events.StartGame;
import camp.mage.server.game.events.Welcome;
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
    private final Map<String, Game> gamesByHost;
    private final List<HallOfFameEntry> hallOfFame;

    public World(Manager manager) {
        this.manager = manager;
        players = new HashMap<>();
        games = new HashMap<>();
        gamesByHost = new HashMap<>();
        hallOfFame = new ArrayList<>();
    }

    public void join(Player player) {
        player.setId(rndId());
        players.put(player.getId(), player);

        manager.send(player, new Welcome(
                player.getId(),
                players.values().stream().filter(p -> p != player).collect(Collectors.toList()),
                new ArrayList<>(games.values()),
                hallOfFame)
        );

        manager.broadcast(new PlayerJoin(player), player);
    }

    public void leave(Player player) {
        players.remove(player.getId());
        manager.broadcast(new PlayerLeave(player), player);
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
        } else if (event instanceof JoinPlayer) {
            String host = ((JoinPlayer) event).getPlayerId();

            Game game;

            if (gamesByHost.containsKey(host)) {
                game = gamesByHost.get(host);
            } else {
                Player h = players.get(host);

                if (h == null) {
                    manager.send(player, new BasicError("player does not exist"));
                    return;
                }

                game = new Game();
                game.setId(rndId());
                game.setHost(h.getId());
                game.setScore(0);
                game.setStarted(false);
                game.setTurn(null);
                game.setPlayers(new ArrayList<>());

                games.put(game.getId(), game);
                gamesByHost.put(game.getHost(), game);

                game.getPlayers().add(h);
            }

            if (game.getPlayers().indexOf(player) != -1) {
                manager.send(player, new BasicError("already in game"));
                return;
            }

            if (game.isStarted()) {
                manager.send(player, new BasicError("game already started"));
                return;
            }

            game.getPlayers().add(player);

            manager.broadcast(new GameState(game), null);
        } else if (event instanceof StartGame) {
            // YAY !!!  GO~!!!!!

            String g = ((StartGame) event).getGameId();

            if (!games.containsKey(g)) {
                manager.send(player, new BasicError("game doesn't exist"));
                return;
            }

            Game game = games.get(g);

            game.setStarted(true);

            // Send to all so that they know it has been started
            manager.broadcast(new GameState(game), null);
        }
    }

    private String rndId() {
        return String.valueOf(new Random().nextInt());
    }
}
