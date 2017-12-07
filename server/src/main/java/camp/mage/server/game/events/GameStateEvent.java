package camp.mage.server.game.events;

import java.util.List;

import camp.mage.server.Event;

/**
 * Created by jacob on 12/7/17.
 */

public class GameStateEvent implements Event {

    @Override
    public String event() {
        return "game_state";
    }

    private String turn;
    private List<String> options;
    private int score;
}
