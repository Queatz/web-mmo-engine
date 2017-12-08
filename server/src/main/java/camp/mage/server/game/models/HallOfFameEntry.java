package camp.mage.server.game.models;

import java.util.List;

/**
 * Created by jacob on 12/7/17.
 */

public class HallOfFameEntry {
    private List<String> team;
    private int score;

    public HallOfFameEntry(List<String> team, int score) {
        this.team = team;
        this.score = score;
    }

    public List<String> getTeam() {
        return team;
    }

    public HallOfFameEntry setTeam(List<String> team) {
        this.team = team;
        return this;
    }

    public int getScore() {
        return score;
    }

    public HallOfFameEntry setScore(int score) {
        this.score = score;
        return this;
    }
}
