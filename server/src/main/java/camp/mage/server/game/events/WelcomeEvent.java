package camp.mage.server.game.events;

import java.util.List;

import camp.mage.server.Event;
import camp.mage.server.game.models.Game;
import camp.mage.server.game.models.HallOfFameEntry;
import camp.mage.server.game.models.Player;

/**
 * Created by jacob on 12/7/17.
 */

public class WelcomeEvent implements Event {

    @Override
    public String event() {
        return "welcome";
    }

    private List<Player> players;
    private List<Game> games;
    private List<HallOfFameEntry> hallOfFame;

    public WelcomeEvent(List<Player> players, List<Game> games, List<HallOfFameEntry> hallOfFame) {
        this.players = players;
        this.games = games;
        this.hallOfFame = hallOfFame;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public WelcomeEvent setPlayers(List<Player> players) {
        this.players = players;
        return this;
    }

    public List<Game> getGames() {
        return games;
    }

    public WelcomeEvent setGames(List<Game> games) {
        this.games = games;
        return this;
    }

    public List<HallOfFameEntry> getHallOfFame() {
        return hallOfFame;
    }

    public WelcomeEvent setHallOfFame(List<HallOfFameEntry> hallOfFame) {
        this.hallOfFame = hallOfFame;
        return this;
    }
}
