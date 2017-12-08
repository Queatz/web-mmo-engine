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
import camp.mage.server.game.events.LeavePlayer;
import camp.mage.server.game.events.NewHof;
import camp.mage.server.game.events.PlayerInfo;
import camp.mage.server.game.events.PlayerJoin;
import camp.mage.server.game.events.PlayerLeave;
import camp.mage.server.game.events.SetPick;
import camp.mage.server.game.events.StartGame;
import camp.mage.server.game.events.Welcome;
import camp.mage.server.game.models.Game;
import camp.mage.server.game.models.HallOfFameEntry;
import camp.mage.server.game.models.Player;
import camp.mage.server.game.models.Turn;

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
        } else if (event instanceof LeavePlayer) {
            String host = ((LeavePlayer) event).getPlayerId();

            if (!gamesByHost.containsKey(host)) {
                manager.send(player, new BasicError("game doesn't exist"));
                return;
            }

            Game game = gamesByHost.get(host);

            if (game.getPlayers().indexOf(player) == -1) {
                manager.send(player, new BasicError("not in game"));
                return;
            }

            // Game is ended.  If we want to continue the game, uncomment this
            // game.getPlayers().remove(player);

            endGame(game);

            // Send to all so that they know left
            manager.broadcast(new GameState(game), null);

        } else if (event instanceof StartGame) {
            // YAY !!!  GO~!!!!!

            String g = ((StartGame) event).getGameId();

            if (!games.containsKey(g)) {
                manager.send(player, new BasicError("game doesn't exist"));
                return;
            }

            Game game = games.get(g);

            if (game.isStarted()) {
                manager.send(player, new BasicError("game already started"));
                return;
            }

            game.setStarted(true);
            game.setTurn(nextTurn(game));

            // Send to all so that they know it has been started
            manager.broadcast(new GameState(game), null);
        } else if (event instanceof SetPick) {
            String g = ((SetPick) event).getGameId();
            int pick = ((SetPick) event).getPick();

            if (!games.containsKey(g)) {
                manager.send(player, new BasicError("game doesn't exist"));
                return;
            }

            Game game = games.get(g);

            if (game.isEnded()) {
                manager.send(player, new BasicError("game already ended"));
                return;
            }

            if (game.getTurn() == null) {
                manager.send(player, new BasicError("something went terribly wrong"));
                return;
            }

            Turn turn = game.getTurn();

            boolean isPicker = player.getId().equals(turn.getPicker());

            if (isPicker) {
                if (turn.getPick() != null) {
                    manager.send(player, new BasicError("already picked"));
                    return;
                }

                turn.setPick(pick);
            } else {
                if (turn.getPick() == null) {
                    manager.send(player, new BasicError("picker hasn't picked"));
                    return;
                }

                if (turn.getGuessers().stream().anyMatch(p -> p.equals(player.getId()))) {
                    manager.send(player, new BasicError("card already picked"));
                    return;
                }

                if (turn.getGuesses().stream().anyMatch(p -> p == pick)) {
                    manager.send(player, new BasicError("card already picked"));
                    return;
                }

                turn.getGuesses().add(pick);
                turn.getGuessers().add(player.getId());
            }

            checkTurn(game);

            // Send to all so that they know it has been started
            manager.broadcast(new GameState(game), null);
        }
    }

    private void checkTurn(Game game) {
        if (game.getTurn() == null) {
            return;
        }

        if (game.getTurn().getGuesses().stream().anyMatch(g -> g.equals(game.getTurn().getPick()))) {
            game.setTurn(nextTurn(game));
            game.setScore(game.getScore() + 1);
        } else if (game.getTurn().getGuesses().size() >= game.getPlayers().size() - 1) {
            endGame(game);
        }
    }

    private Turn nextTurn(Game game) {
        return new Turn()
                .setGuesses(new ArrayList<>())
                .setGuessers(new ArrayList<>())
                .setPick(null)
                .setPicker(nextPicker(game))
                .setOptions(new Random().ints(game.getPlayers().size() + 1, 1, 10)
                        .mapToObj(String::valueOf)
                        .collect(Collectors.toList()));
    }

    private String nextPicker(Game game) {
        if (game.getPlayers().isEmpty()) {
            return null;
        }

        if (game.getTurn() == null) {
            return game.getPlayers().get(0).getId();
        }

        String picker = game.getTurn().getPicker();

        if (picker == null) {
            return null;
        }

        Player current = players.get(picker);

        if (current == null) {
            return null;
        }

        int i = game.getPlayers().indexOf(current);

        if (i == -1) {
            return null;
        } else {
            return game.getPlayers().get((i + 1) % game.getPlayers().size()).getId();
        }
    }

    private void endGame(Game game) {
        game.setEnded(true);
        game.setTurn(null);
        games.remove(game.getId());
        gamesByHost.remove(game.getHost());

        HallOfFameEntry hof = new HallOfFameEntry()
                .setTeam(game.getPlayers().stream()
                        .map(Player::getName)
                        .collect(Collectors.toList()))
                .setScore(game.getScore());

        hallOfFame.add(hof);
        hallOfFame.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));

        manager.broadcast(new NewHof(hallOfFame), null);
    }

    private String rndId() {
        return String.valueOf(new Random().nextInt());
    }
}
