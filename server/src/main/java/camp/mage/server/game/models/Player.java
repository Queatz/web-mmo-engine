package camp.mage.server.game.models;

/**
 * Created by jacob on 12/6/17.
 */

public class Player {

    private String id;
    private String name;

    public String getId() {
        return id;
    }

    public Player setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public Player setName(String name) {
        this.name = name;
        return this;
    }

}
