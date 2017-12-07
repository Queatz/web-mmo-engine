package camp.mage.server.game.events;

import java.util.List;

import camp.mage.server.Event;
import camp.mage.server.game.models.Game;
import camp.mage.server.game.models.HallOfFameEntry;
import camp.mage.server.game.models.Player;

/**
 * Created by jacob on 12/7/17.
 */

public class Welcome implements Event {

    @Override
    public String event() {
        return "welcome";
    }

    private String me;
    private List<Player> players;
    private List<Game> games;
    private List<HallOfFameEntry> hallOfFame;

    public Welcome(String me, List<Player> players, List<Game> games, List<HallOfFameEntry> hallOfFame) {
        this.me = me;
        this.players = players;
        this.games = games;
        this.hallOfFame = hallOfFame;
    }

    public String getMe() {
        return me;
    }

    public Welcome setMe(String me) {
        this.me = me;
        return this;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public Welcome setPlayers(List<Player> players) {
        this.players = players;
        return this;
    }

    public List<Game> getGames() {
        return games;
    }

    public Welcome setGames(List<Game> games) {
        this.games = games;
        return this;
    }

    public List<HallOfFameEntry> getHallOfFame() {
        return hallOfFame;
    }

    public Welcome setHallOfFame(List<HallOfFameEntry> hallOfFame) {
        this.hallOfFame = hallOfFame;
        return this;
    }
}
