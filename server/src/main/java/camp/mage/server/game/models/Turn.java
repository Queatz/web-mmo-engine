package camp.mage.server.game.models;

import java.util.List;

/**
 * Created by jacob on 12/7/17.
 */

public class Turn {
    private List<String> options;
    private List<String> guessers;
    private List<Integer> guesses;
    private String picker;
    private Integer pick;

    public List<String> getOptions() {
        return options;
    }

    public Turn setOptions(List<String> options) {
        this.options = options;
        return this;
    }

    public List<String> getGuessers() {
        return guessers;
    }

    public Turn setGuessers(List<String> guessers) {
        this.guessers = guessers;
        return this;
    }

    public List<Integer> getGuesses() {
        return guesses;
    }

    public Turn setGuesses(List<Integer> guesses) {
        this.guesses = guesses;
        return this;
    }

    public String getPicker() {
        return picker;
    }

    public Turn setPicker(String picker) {
        this.picker = picker;
        return this;
    }

    public Integer getPick() {
        return pick;
    }

    public Turn setPick(Integer pick) {
        this.pick = pick;
        return this;
    }
}
