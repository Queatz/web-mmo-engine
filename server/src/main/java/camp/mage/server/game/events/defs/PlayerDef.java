package camp.mage.server.game.events.defs;

/**
 * Created by jacob on 12/31/17.
 */

public class PlayerDef {
    public String id;
    public String name;

    public PlayerDef() {}

    public PlayerDef(String id, String name) {
        this.id = id;
        this.name = name;
    }
}
