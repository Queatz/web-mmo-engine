package camp.mage.server.game.events;

import java.util.List;

import camp.mage.server.Event;
import camp.mage.server.game.models.Game;
import camp.mage.server.game.models.HallOfFameEntry;

/**
 * Created by jacob on 12/7/17.
 */

public class WelcomeEvent implements Event {

    @Override
    public String event() {
        return "welcome";
    }

    private List<Game> games;
    private List<HallOfFameEntry> hallOfFame;

    public WelcomeEvent(List<Game> games, List<HallOfFameEntry> hallOfFame) {
        this.games = games;
        this.hallOfFame = hallOfFame;
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
