package camp.mage.server.game.events;

import camp.mage.server.Event;

/**
 * Created by jacob on 12/8/17.
 */

public class SetPick implements Event {
    @Override
    public String event() {
        return "set_pick";
    }

    private String gameId;
    private int pick;

    public String getGameId() {
        return gameId;
    }

    public SetPick setGameId(String gameId) {
        this.gameId = gameId;
        return this;
    }

    public int getPick() {
        return pick;
    }

    public SetPick setPick(int pick) {
        this.pick = pick;
        return this;
    }
}
