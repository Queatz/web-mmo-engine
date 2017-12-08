package camp.mage.server.game.events;

import java.util.List;

import camp.mage.server.Event;
import camp.mage.server.game.models.HallOfFameEntry;

/**
 * Created by jacob on 12/8/17.
 */

public class NewHof implements Event {
    @Override
    public String event() {
        return "new_hof";
    }

    private List<HallOfFameEntry> hallOfFame;

    public NewHof(List<HallOfFameEntry> hallOfFame) {
        this.hallOfFame = hallOfFame;
    }

    public List<HallOfFameEntry> getHallOfFame() {
        return hallOfFame;
    }

    public NewHof setHallOfFame(List<HallOfFameEntry> hallOfFame) {
        this.hallOfFame = hallOfFame;
        return this;
    }
}
