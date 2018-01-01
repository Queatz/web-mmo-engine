package camp.mage.server.game.objs;

import camp.mage.server.game.World;

/**
 * Created by jacob on 12/6/17.
 */

public class Player extends BaseObject {

    private String name;

    public Player(World world) {
        super(world);
    }

    @Override
    public String getType() {
        return "player";
    }

    public String getName() {
        return name;
    }

    public Player setName(String name) {
        this.name = name;
        return this;
    }
}
