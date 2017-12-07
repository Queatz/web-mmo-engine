package camp.mage.server.game.models;

import java.util.List;

/**
 * Created by jacob on 12/7/17.
 */

public class Game {

    private String id;
    private List<Player> players;
    private int score;
    private Turn turn;
    private boolean started;
}
