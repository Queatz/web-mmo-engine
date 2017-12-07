package camp.mage.server.game.models;

import java.util.List;

/**
 * Created by jacob on 12/7/17.
 */

public class Game {

    private String id;
    private String host;
    private List<Player> players;
    private int score;
    private Turn turn;
    private boolean started;

    public String getId() {
        return id;
    }

    public Game setId(String id) {
        this.id = id;
        return this;
    }

    public String getHost() {
        return host;
    }

    public Game setHost(String host) {
        this.host = host;
        return this;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public Game setPlayers(List<Player> players) {
        this.players = players;
        return this;
    }

    public int getScore() {
        return score;
    }

    public Game setScore(int score) {
        this.score = score;
        return this;
    }

    public Turn getTurn() {
        return turn;
    }

    public Game setTurn(Turn turn) {
        this.turn = turn;
        return this;
    }

    public boolean isStarted() {
        return started;
    }

    public Game setStarted(boolean started) {
        this.started = started;
        return this;
    }
}
